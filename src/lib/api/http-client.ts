import { ApiError, type ApiClient, type RealtimeClient } from '@/lib/api/client';
import type {
  Campaign,
  CampaignList,
  Clinic,
  ClinicSettings,
  Contact,
  Conversation,
  ConversationMetrics,
  ConversationSummary,
  Message,
  MessageEvent,
  Page,
  Quota,
  Template,
  WidgetSnippet,
  WidgetStatus,
  Workspace,
} from '@/lib/api/types';

export type TokenProvider = () => Promise<string | null>;

interface HttpClientOptions {
  baseUrl: string;
  wsUrl?: string;
  getToken: TokenProvider;
}

type Query = Record<string, string | number | boolean | null | undefined>;

interface RequestOptions {
  query?: Query;
  json?: unknown;
  formData?: FormData;
}

const toQueryString = (query?: Query) => {
  if (!query) return '';
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== '') params.append(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : '';
};

const readErrorDetail = async (response: Response) => {
  try {
    const body = await response.json();
    if (typeof body?.detail === 'string') return body.detail;
    if (typeof body?.error === 'string') return body.error;
  } catch {
    // Non-JSON error body; fall through to the generic message.
  }
  return undefined;
};

export const createHttpClient = ({ baseUrl, wsUrl, getToken }: HttpClientOptions): ApiClient => {
  const request = async <T>(method: string, path: string, options: RequestOptions = {}): Promise<T> => {
    const token = await getToken();
    const headers: Record<string, string> = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    let body: BodyInit | undefined;
    if (options.formData) {
      body = options.formData;
    } else if (options.json !== undefined) {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(options.json);
    }

    const response = await fetch(`${baseUrl}${path}${toQueryString(options.query)}`, {
      method,
      headers,
      body,
      credentials: 'include',
    });

    if (!response.ok) throw new ApiError(response.status, await readErrorDetail(response));
    if (response.status === 204) return undefined as T;

    const text = await response.text();
    return (text ? JSON.parse(text) : undefined) as T;
  };

  const get = <T>(path: string, query?: Query) => request<T>('GET', path, { query });

  return {
    workspace: {
      get: () => get<Workspace>('/api/v1/gateway/identity'),
      getClinic: () => get<Clinic>('/api/v1/clinic'),
      updateClinic: (input) => request<Clinic>('PATCH', '/api/v1/clinic', { json: input }),
      acceptTerms: () => request<void>('POST', '/api/v1/clinic/accept-terms'),
      connectWhatsApp: (input) => request<void>('POST', '/api/v1/whatsapp/connect', { json: input }),
    },
    settings: {
      get: () => get<ClinicSettings>('/api/v1/clinic/settings'),
      update: (patch) => request<ClinicSettings>('PATCH', '/api/v1/clinic/settings', { json: patch }),
      uploadLogo: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return request<{ logo: string }>('POST', '/api/v1/clinic/settings/logo', { formData });
      },
    },
    widget: {
      getSnippet: () => get<WidgetSnippet>('/api/v1/gateway/snippet'),
      getStatus: () => get<WidgetStatus>('/api/v1/gateway/widget-status'),
    },
    billing: {
      getQuota: () => get<Quota>('/api/v1/gateway/quota'),
    },
    conversations: {
      list: ({ page, size, assistNeeded, search }) =>
        get<Page<Conversation>>('/api/v1/conversations', {
          page,
          size,
          transferred_to_human: assistNeeded ? true : undefined,
          message__content__ilike: search,
          full_name__ilike: search,
        }),
      get: (leadId) => get<Conversation>(`/api/v1/conversations/${leadId}`),
      metrics: () => get<ConversationMetrics>('/api/v1/conversations/metrics'),
      messages: (leadId) => get<Message[]>(`/api/v1/conversations/${leadId}/messages`),
      getSummary: (leadId) => get<ConversationSummary>(`/api/v1/conversations/${leadId}/summary`),
      regenerateSummary: (leadId) => request<void>('POST', `/api/v1/conversations/${leadId}/summary`),
      setHandover: (leadId, toHuman) =>
        request<void>(
          'PUT',
          `/api/v1/conversations/${leadId}/${toHuman ? 'transfer-to-human' : 'transfer-to-ai'}`,
          {
            json: { transferred_to_human: toHuman, lead_id: leadId },
          },
        ),
    },
    contacts: {
      list: () => get<Contact[]>('/api/v1/contacts'),
      create: (input) => request<Contact>('POST', '/api/v1/contacts', { json: input }),
      update: (id, patch) => request<Contact>('PATCH', `/api/v1/contacts/${id}`, { json: patch }),
      remove: (id) => request<void>('DELETE', `/api/v1/contacts/${id}`),
      removeMany: (ids) => request<void>('DELETE', '/api/v1/contacts/bulk-delete', { json: ids }),
    },
    campaigns: {
      list: () => get<CampaignList>('/api/v1/campaigns'),
      create: (input) => request<Campaign>('POST', '/api/v1/campaigns', { json: input }),
    },
    templates: {
      list: (params) => get<Template[]>('/api/v1/whatsapp/templates', { ...params }),
      create: (input) => request<Template>('POST', '/api/v1/whatsapp/templates', { json: input }),
    },
    realtime: createWebSocketRealtime(wsUrl, getToken),
  };
};

/**
 * Minimal reconnecting WebSocket used for live conversation and message updates.
 * Each subscription owns one socket; message sockets are also used for sending.
 */
const createWebSocketRealtime = (wsUrl: string | undefined, getToken: TokenProvider): RealtimeClient => {
  const messageSockets = new Map<string, WebSocket>();

  const connect = <T>(
    path: string,
    onData: (data: T) => void,
    onSocket?: (socket: WebSocket | null) => void,
  ) => {
    if (!wsUrl) return () => undefined;

    let socket: WebSocket | null = null;
    let closed = false;
    let retry = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;

    const open = async () => {
      const token = await getToken();
      if (closed) return;
      const separator = path.includes('?') ? '&' : '?';
      socket = new WebSocket(
        `${wsUrl}${path}${token ? `${separator}token=${encodeURIComponent(token)}` : ''}`,
      );
      onSocket?.(socket);
      socket.onopen = () => {
        retry = 0;
      };
      socket.onmessage = (event) => {
        try {
          onData(JSON.parse(event.data) as T);
        } catch {
          // Ignore frames that are not JSON (e.g. keep-alives).
        }
      };
      socket.onclose = () => {
        onSocket?.(null);
        if (closed) return;
        const delay = Math.min(30_000, 1_000 * 2 ** retry++);
        timer = setTimeout(open, delay);
      };
    };

    void open();

    return () => {
      closed = true;
      if (timer) clearTimeout(timer);
      socket?.close();
      onSocket?.(null);
    };
  };

  return {
    subscribeConversations: (listener) => connect<Conversation>('/conversations', listener),
    subscribeMessages: (leadId, listener) =>
      connect<MessageEvent | Message>(
        `/conversations/${leadId}/messages`,
        (data) => {
          // Older backends push bare Message objects instead of typed events.
          listener('type' in data ? data : { type: 'new_message', payload: data });
        },
        (socket) => {
          if (socket) messageSockets.set(leadId, socket);
          else messageSockets.delete(leadId);
        },
      ),
    sendMessage: async (leadId, input) => {
      const socket = messageSockets.get(leadId);
      if (!socket || socket.readyState !== WebSocket.OPEN) {
        throw new Error('Not connected. Please wait a moment and try again.');
      }
      socket.send(JSON.stringify({ ...input, author: 'system', template_id: input.template_id ?? null }));
    },
  };
};
