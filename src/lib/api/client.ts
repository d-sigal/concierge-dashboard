import type {
  Campaign,
  CampaignList,
  Clinic,
  ClinicSettings,
  ConnectWhatsAppInput,
  Contact,
  Conversation,
  ConversationListParams,
  ConversationMetrics,
  ConversationSummary,
  CreateCampaignInput,
  CreateContactInput,
  CreateTemplateInput,
  Message,
  MessageEvent,
  Page,
  Quota,
  SendMessageInput,
  Template,
  TemplateListParams,
  UpdateClinicInput,
  UpdateContactInput,
  WidgetSnippet,
  WidgetStatus,
  Workspace,
} from '@/lib/api/types';

/**
 * The single seam between the UI and the outside world.
 *
 * The UI never calls `fetch` directly; it calls an ApiClient obtained from
 * `useApi()`. Two implementations ship with the project:
 *   - `createHttpClient` talks to a real backend (see docs/API.md)
 *   - `createMockClient` keeps everything in memory for demo mode
 */
export interface ApiClient {
  workspace: {
    get(): Promise<Workspace>;
    getClinic(): Promise<Clinic>;
    updateClinic(input: UpdateClinicInput): Promise<Clinic>;
    acceptTerms(): Promise<void>;
    /** Finish WhatsApp onboarding after Meta's embedded signup returns a WABA id. */
    connectWhatsApp(input: ConnectWhatsAppInput): Promise<void>;
  };
  settings: {
    get(): Promise<ClinicSettings>;
    update(patch: Partial<ClinicSettings>): Promise<ClinicSettings>;
    uploadLogo(file: File): Promise<{ logo: string }>;
  };
  widget: {
    getSnippet(): Promise<WidgetSnippet>;
    getStatus(): Promise<WidgetStatus>;
  };
  billing: {
    getQuota(): Promise<Quota>;
  };
  conversations: {
    list(params: ConversationListParams): Promise<Page<Conversation>>;
    get(leadId: string): Promise<Conversation>;
    metrics(): Promise<ConversationMetrics>;
    /** Newest first. */
    messages(leadId: string): Promise<Message[]>;
    getSummary(leadId: string): Promise<ConversationSummary>;
    regenerateSummary(leadId: string): Promise<void>;
    /** Hand the conversation to a human (`true`) or back to the AI assistant (`false`). */
    setHandover(leadId: string, toHuman: boolean): Promise<void>;
  };
  contacts: {
    list(): Promise<Contact[]>;
    create(input: CreateContactInput): Promise<Contact>;
    update(id: string, patch: UpdateContactInput): Promise<Contact>;
    remove(id: string): Promise<void>;
    removeMany(ids: string[]): Promise<void>;
  };
  campaigns: {
    list(): Promise<CampaignList>;
    create(input: CreateCampaignInput): Promise<Campaign>;
  };
  templates: {
    list(params?: TemplateListParams): Promise<Template[]>;
    create(input: CreateTemplateInput): Promise<Template>;
  };
  realtime: RealtimeClient;
}

export type Unsubscribe = () => void;

export interface RealtimeClient {
  /** Fires with the full, updated conversation whenever one changes or a new one starts. */
  subscribeConversations(listener: (conversation: Conversation) => void): Unsubscribe;
  subscribeMessages(leadId: string, listener: (event: MessageEvent) => void): Unsubscribe;
  sendMessage(leadId: string, input: SendMessageInput): Promise<void>;
}

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly detail: string | undefined,
  ) {
    super(detail ?? `Request failed with status ${status}`);
    this.name = 'ApiError';
  }
}

/** Best human-readable message for any thrown value. */
export const getErrorMessage = (error: unknown, fallback = 'Something went wrong. Please try again.') => {
  if (error instanceof ApiError && error.detail) return error.detail;
  if (error instanceof Error && error.message) return error.message;
  return fallback;
};
