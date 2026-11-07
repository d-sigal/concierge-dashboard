/**
 * Domain types shared by the UI and every ApiClient implementation.
 * Field names mirror the backend JSON contract documented in docs/API.md.
 */

export type ChannelKey = 'whatsapp' | 'chat';

export type ContactType = 'lead' | 'client';

export type MessageStatus =
  'pending' | 'sent' | 'delivered' | 'read' | 'undelivered' | 'failed' | 'not_available';

export interface Page<T> {
  items: T[];
  total: number;
  /** 1-based page index. */
  page: number;
  size: number;
  pages: number;
}

/** The signed-in workspace (one business / clinic). */
export interface Workspace {
  id: string;
  /** False until the backend has provisioned messaging for this workspace. */
  active: boolean;
  phone_number: string | null;
}

export interface Clinic {
  name: string;
  phone: string;
  language: string;
  url: string | null;
  website_last_crawled_at: string | null;
  is_onboarded: boolean;
  waba_active: boolean;
  terms_accepted: boolean;
}

export interface UpdateClinicInput {
  url?: string | null;
  language?: string;
  is_onboarded?: boolean;
}

export interface ConnectWhatsAppInput {
  /** WhatsApp Business Account id returned by Meta's embedded signup. */
  waba_id: string;
  phone_number: string;
  display_name: string;
}

export interface ClinicSettings {
  default_language: string;
  timezone: string | null;
  email: string | null;
  live_chat_enabled: boolean;
  concierge_enabled: boolean | null;
  business_name: string | null;
  logo: string | null;
  default_currency: string | null;
  website: string | null;
  whatsapp_chat_enabled: boolean;
  live_chat_pre_message: string | null;
  phone_number: string | null;
  clinic_type: string | null;
  additional_settings: string;
}

/** Opaque configuration object passed to the website widget's init call. */
export type WidgetSnippet = Record<string, unknown>;

export interface WidgetStatus {
  /** True once the widget has been seen running on the customer's website. */
  status: boolean;
}

export interface QuotaUpsell {
  next_plan: string;
  on_demand_price: string;
}

export interface Subscription {
  name: string;
  description: string;
  next_billing_date: string;
  price: number;
  on_demand_price: string;
  interval: string;
  currency: string;
}

export interface Quota {
  total: number;
  consumed: number;
  on_demand_value: number;
  subscription: Subscription | null;
  near_limit: false | QuotaUpsell;
  exceeded: false | QuotaUpsell;
}

export interface Conversation {
  lead_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone_number: string | null;
  type: ContactType;
  is_client: boolean;
  last_message_content: string;
  /** Unix epoch seconds. */
  last_message_timestamp: number;
  /** True when a human has taken over from the AI assistant. */
  transferred_to_human: boolean;
  authenticated: boolean;
  /** False when WhatsApp's 24h customer-service window is closed and only templates may be sent. */
  free_message_allowed: boolean;
  created_at: string;
}

export interface ConversationListParams {
  page: number;
  size: number;
  /** Only conversations handed over to a human. */
  assistNeeded?: boolean;
  search?: string | null;
}

export interface ConversationMetrics {
  total: number;
  assist_needed: number;
}

export interface ConversationSummary {
  summary: string;
  /** Unix epoch seconds. */
  updated_at: number;
}

export interface Message {
  id: string;
  /** `system` for messages sent by the business (AI or staff); anything else is the customer. */
  author: string;
  body: string;
  channel: ChannelKey;
  status: MessageStatus;
  /** `yyyy-MM-dd HH:mm:ssX`, used for date separators. */
  date_created: string;
  /** Unix epoch seconds. */
  date_created_timestamp: number;
  /** True for the synthetic marker emitted when the conversation switches channel. */
  is_channel_updated: boolean;
}

export interface SendMessageInput {
  body: string;
  channel: ChannelKey;
  /** Required on WhatsApp when `free_message_allowed` is false. */
  template_id?: string | null;
}

export type MessageEvent =
  | { type: 'new_message'; payload: Message }
  | { type: 'message_status_update'; payload: { message_id: string; status: MessageStatus } };

export interface Contact {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  type: ContactType;
  created_at: string;
  updated_at: string;
}

export interface CreateContactInput {
  phone_number: string;
  name?: string;
  email?: string;
  type?: ContactType;
}

export type UpdateContactInput = Partial<Pick<Contact, 'full_name' | 'email' | 'phone_number' | 'type'>>;

export type CampaignStatus = 'Active' | 'Inactive' | 'Pending' | 'Sent' | 'Paused' | 'Cancelled';

export interface CampaignLead {
  id: string;
  name: string;
  type: ContactType;
  phone?: string;
}

export interface Campaign {
  id: string;
  name: string;
  status: CampaignStatus;
  scheduled_time: string;
  template_id: string;
  leads: CampaignLead[];
  statuses: { lead_id: string; status: 'done' | 'failed' | 'pending' }[];
  /** Number of recipients that read the message. */
  read?: number;
  /** Number of recipients that replied. */
  replied?: number;
}

export interface CampaignList {
  campaigns: Campaign[];
  limit: number;
  offset: number;
  total: number;
}

export interface CreateCampaignInput {
  name: string;
  template_id: string;
  /** ISO date-time, or null to send immediately. */
  scheduled_time: string | null;
  lead_ids: string[];
}

export type TemplateStatus = 'draft' | 'review' | 'approved' | 'rejected';

export interface Template {
  id: string;
  name: string;
  category: string;
  status: TemplateStatus;
  message: string;
  language: string;
  auto_category: boolean;
  created_at: string;
  updated_at: string;
}

export interface TemplateListParams {
  status?: TemplateStatus;
  /** Restrict to templates usable for this conversation. */
  lead_id?: string;
}

export interface CreateTemplateInput {
  name: string;
  category: string;
  language: string;
  message: string;
  auto_category?: boolean;
  /** `draft` saves without submitting; `review` submits to Meta for approval. */
  status: 'draft' | 'review';
}
