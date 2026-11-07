import { ApiError, type ApiClient, type RealtimeClient } from '@/lib/api/client';
import { createSeed, type MockDb } from '@/lib/api/mock/seed';
import type { Conversation, Message, MessageEvent, MessageStatus, SendMessageInput } from '@/lib/api/types';

/**
 * In-memory ApiClient used in demo mode (no NEXT_PUBLIC_API_URL).
 * State lives for the lifetime of the browser tab; reload to reset.
 */

const delay = <T>(value: T, ms = 120 + Math.random() * 180) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(structuredClone(value)), ms));

const nowSeconds = () => Math.floor(Date.now() / 1000);
const formatDateCreated = (ms: number) =>
  new Date(ms)
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, 'Z');
const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random()}`;

const assistantReplies = [
  'Thanks for your message! Let me check that for you.',
  'Happy to help. Could you share a little more detail?',
  'Got it. I have passed this on and someone will confirm shortly.',
  'Great question! Our team is available Monday to Saturday, 9:00 AM to 6:00 PM.',
];

const incomingSamples = [
  'Hi, is it possible to book for tomorrow morning?',
  'Thank you so much for the quick reply!',
  'Can I bring someone with me to the appointment?',
  'What should I do to prepare for my visit?',
];

class Emitter<T> {
  private listeners = new Set<(value: T) => void>();
  on(listener: (value: T) => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  emit(value: T) {
    this.listeners.forEach((listener) => listener(value));
  }
}

export const createMockClient = (): ApiClient => {
  const db: MockDb = createSeed();
  const conversationEvents = new Emitter<Conversation>();
  const messageEvents = new Map<string, Emitter<MessageEvent>>();

  const messageEmitter = (leadId: string) => {
    let emitter = messageEvents.get(leadId);
    if (!emitter) {
      emitter = new Emitter<MessageEvent>();
      messageEvents.set(leadId, emitter);
    }
    return emitter;
  };

  const findConversation = (leadId: string) => {
    const conversation = db.conversations.find((c) => c.lead_id === leadId);
    if (!conversation) throw new ApiError(404, 'Conversation not found');
    return conversation;
  };

  const appendMessage = (
    leadId: string,
    author: string,
    input: Pick<SendMessageInput, 'body' | 'channel'>,
  ) => {
    const ms = Date.now();
    const message: Message = {
      id: uid(),
      author,
      body: input.body,
      channel: input.channel,
      status: author === 'system' ? 'pending' : 'not_available',
      date_created: formatDateCreated(ms),
      date_created_timestamp: Math.floor(ms / 1000),
      is_channel_updated: false,
    };
    db.messages[leadId] = [message, ...(db.messages[leadId] ?? [])];

    const conversation = findConversation(leadId);
    conversation.last_message_content = message.body;
    conversation.last_message_timestamp = message.date_created_timestamp;
    db.conversations = [conversation, ...db.conversations.filter((c) => c.lead_id !== leadId)];

    messageEmitter(leadId).emit({ type: 'new_message', payload: structuredClone(message) });
    conversationEvents.emit(structuredClone(conversation));
    return message;
  };

  const updateStatus = (leadId: string, messageId: string, status: MessageStatus) => {
    const message = db.messages[leadId]?.find((m) => m.id === messageId);
    if (!message) return;
    message.status = status;
    messageEmitter(leadId).emit({
      type: 'message_status_update',
      payload: { message_id: messageId, status },
    });
  };

  const simulateDelivery = (leadId: string, messageId: string) => {
    setTimeout(() => updateStatus(leadId, messageId, 'sent'), 400);
    setTimeout(() => updateStatus(leadId, messageId, 'delivered'), 1200);
    setTimeout(() => updateStatus(leadId, messageId, 'read'), 2800);
  };

  // Keep the demo feeling alive: a customer writes in every so often.
  if (typeof window !== 'undefined') {
    setInterval(() => {
      const conversation = db.conversations[Math.floor(Math.random() * Math.min(8, db.conversations.length))];
      if (!conversation) return;
      const body = incomingSamples[Math.floor(Math.random() * incomingSamples.length)];
      const channel = db.messages[conversation.lead_id]?.[0]?.channel ?? 'whatsapp';
      appendMessage(conversation.lead_id, conversation.lead_id, { body, channel });

      // Conversations not handed over to a human get an automatic assistant reply.
      if (!conversation.transferred_to_human) {
        setTimeout(() => {
          const reply = assistantReplies[Math.floor(Math.random() * assistantReplies.length)];
          const sent = appendMessage(conversation.lead_id, 'system', { body: reply, channel });
          simulateDelivery(conversation.lead_id, sent.id);
        }, 2_000);
      }
    }, 45_000);
  }

  const realtime: RealtimeClient = {
    subscribeConversations: (listener) => conversationEvents.on(listener),
    subscribeMessages: (leadId, listener) => messageEmitter(leadId).on(listener),
    sendMessage: async (leadId, input) => {
      const sent = appendMessage(leadId, 'system', input);
      simulateDelivery(leadId, sent.id);
    },
  };

  return {
    workspace: {
      get: () => delay(db.workspace),
      getClinic: () => delay(db.clinic),
      updateClinic: async (input) => {
        Object.assign(db.clinic, input);
        if (input.url === null) db.clinic.website_last_crawled_at = null;
        if (input.url) db.clinic.website_last_crawled_at = new Date().toISOString();
        return delay(db.clinic);
      },
      acceptTerms: async () => {
        db.clinic.terms_accepted = true;
        return delay(undefined);
      },
      connectWhatsApp: async ({ phone_number }) => {
        db.clinic.waba_active = true;
        db.workspace.phone_number = phone_number;
        return delay(undefined, 800);
      },
    },
    settings: {
      get: () => delay(db.settings),
      update: async (patch) => {
        Object.assign(db.settings, patch);
        return delay(db.settings);
      },
      uploadLogo: async (file) => {
        db.settings.logo = URL.createObjectURL(file);
        return delay({ logo: db.settings.logo }, 600);
      },
    },
    widget: {
      getSnippet: () =>
        delay({
          workspaceId: db.workspace.id,
          theme: 'light',
          position: 'bottom-right',
          greeting: db.settings.live_chat_pre_message,
        }),
      getStatus: () => delay({ status: db.widgetInstalled }),
    },
    billing: {
      getQuota: () => delay(db.quota),
    },
    conversations: {
      list: async ({ page, size, assistNeeded, search }) => {
        const term = search?.trim().toLowerCase();
        const filtered = db.conversations.filter((c) => {
          if (assistNeeded && !c.transferred_to_human) return false;
          if (!term) return true;
          const name = `${c.first_name ?? ''} ${c.last_name ?? ''}`.toLowerCase();
          const inMessages = db.messages[c.lead_id]?.some((m) => m.body.toLowerCase().includes(term));
          return name.includes(term) || Boolean(inMessages);
        });
        const pages = Math.max(1, Math.ceil(filtered.length / size));
        const items = filtered.slice((page - 1) * size, page * size);
        return delay({ items, total: filtered.length, page, size, pages });
      },
      get: async (leadId) => delay(findConversation(leadId)),
      metrics: async () =>
        delay({
          total: db.conversations.length,
          assist_needed: db.conversations.filter((c) => c.transferred_to_human).length,
        }),
      messages: async (leadId) => delay(db.messages[leadId] ?? []),
      getSummary: async (leadId) => delay(db.summaries[leadId] ?? { summary: '', updated_at: nowSeconds() }),
      regenerateSummary: async (leadId) => {
        const summary = db.summaries[leadId];
        if (summary) summary.updated_at = nowSeconds();
        return delay(undefined, 900);
      },
      setHandover: async (leadId, toHuman) => {
        const conversation = findConversation(leadId);
        conversation.transferred_to_human = toHuman;
        conversationEvents.emit(structuredClone(conversation));
        return delay(undefined);
      },
    },
    contacts: {
      list: () => delay(db.contacts),
      create: async (input) => {
        if (db.contacts.some((c) => c.phone_number === input.phone_number)) {
          throw new ApiError(409, 'A contact with this phone number already exists.');
        }
        const created = new Date().toISOString();
        const contact = {
          id: uid(),
          full_name: input.name ?? '',
          email: input.email ?? '',
          phone_number: input.phone_number,
          type: input.type ?? 'lead',
          created_at: created,
          updated_at: created,
        };
        db.contacts = [contact, ...db.contacts];
        return delay(contact);
      },
      update: async (contactId, patch) => {
        const contact = db.contacts.find((c) => c.id === contactId);
        if (!contact) throw new ApiError(404, 'Contact not found');
        Object.assign(contact, patch, { updated_at: new Date().toISOString() });
        return delay(contact);
      },
      remove: async (contactId) => {
        db.contacts = db.contacts.filter((c) => c.id !== contactId);
        return delay(undefined);
      },
      removeMany: async (ids) => {
        db.contacts = db.contacts.filter((c) => !ids.includes(c.id));
        return delay(undefined);
      },
    },
    campaigns: {
      list: () => delay({ campaigns: db.campaigns, limit: 100, offset: 0, total: db.campaigns.length }),
      create: async (input) => {
        const leads = db.contacts
          .filter((c) => input.lead_ids.includes(c.id))
          .map((c) => ({ id: c.id, name: c.full_name, type: c.type, phone: c.phone_number }));
        const campaign = {
          id: uid(),
          name: input.name,
          status: 'Active' as const,
          scheduled_time: input.scheduled_time ?? new Date().toISOString(),
          template_id: input.template_id,
          leads,
          statuses: [],
          read: 0,
          replied: 0,
        };
        db.campaigns = [campaign, ...db.campaigns];
        return delay(campaign);
      },
    },
    templates: {
      list: async (params) =>
        delay(db.templates.filter((t) => !params?.status || t.status === params.status)),
      create: async (input) => {
        const created = new Date().toISOString();
        const template = {
          id: uid(),
          name: input.name,
          category: input.category,
          language: input.language,
          message: input.message,
          auto_category: input.auto_category ?? false,
          status: input.status,
          created_at: created,
          updated_at: created,
        };
        db.templates = [template, ...db.templates];
        return delay(template);
      },
    },
    realtime,
  };
};
