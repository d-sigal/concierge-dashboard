import type {
  Campaign,
  Clinic,
  ClinicSettings,
  Contact,
  ContactType,
  Conversation,
  Message,
  Quota,
  Template,
  Workspace,
} from '@/lib/api/types';

/**
 * Fictional demo data. Every name, number and address here is made up;
 * phone numbers use the reserved 555-01xx range.
 */

const people: [first: string, last: string, type: ContactType][] = [
  ['Avery', 'Collins', 'client'],
  ['Jordan', 'Reyes', 'lead'],
  ['Taylor', 'Nguyen', 'client'],
  ['Morgan', 'Patel', 'lead'],
  ['Riley', 'Bennett', 'lead'],
  ['Casey', 'Okafor', 'client'],
  ['Jamie', 'Lindqvist', 'lead'],
  ['Quinn', 'Moreau', 'client'],
  ['Skyler', 'Haddad', 'lead'],
  ['Rowan', 'Fischer', 'lead'],
  ['Emerson', 'Tanaka', 'client'],
  ['Parker', 'Silva', 'lead'],
  ['Hayden', 'Kowalski', 'lead'],
  ['Reese', 'Abernathy', 'client'],
  ['Dakota', 'Mensah', 'lead'],
  ['Sage', 'Romero', 'lead'],
  ['Finley', 'Oduya', 'client'],
  ['Blake', 'Ivanova', 'lead'],
  ['Cameron', 'Duarte', 'lead'],
  ['Elliot', 'Nakamura', 'client'],
  ['Harper', 'Quist', 'lead'],
  ['Kendall', 'Varga', 'lead'],
];

/** Each script is a list of [author, body]; `system` is the business side. */
const scripts: [string, string][][] = [
  [
    ['customer', 'Hi! Do you have any availability for a consultation this week?'],
    [
      'system',
      'Hi there! We have openings on Thursday at 10:00 AM and Friday at 2:30 PM. Would either work for you?',
    ],
    ['customer', 'Thursday at 10 works great.'],
    [
      'system',
      "Perfect, you're booked for Thursday at 10:00 AM. You'll receive a confirmation by text shortly.",
    ],
  ],
  [
    ['customer', 'How much is a follow-up appointment?'],
    [
      'system',
      'Follow-up appointments are $85 and last about 20 minutes. Would you like me to find a time for you?',
    ],
    ['customer', 'Can I speak to someone about my invoice? I think I was charged twice.'],
    [
      'system',
      "I'm sorry about that! I've flagged this for our front desk team and someone will reply here shortly.",
    ],
  ],
  [
    ['customer', 'What are your opening hours on Saturday?'],
    ['system', "We're open Saturdays from 9:00 AM to 3:00 PM. Is there anything else I can help with?"],
  ],
  [
    ['customer', 'Is there parking near the clinic?'],
    ['system', 'Yes, there is free parking behind the building with the entrance on Maple Street.'],
    ['customer', 'Great, thanks!'],
  ],
  [
    ['customer', 'I need to reschedule my appointment next Tuesday.'],
    [
      'system',
      'No problem. I can move you to Wednesday at 11:00 AM or Thursday at 4:00 PM. Which do you prefer?',
    ],
    ['customer', 'Wednesday please'],
    ['system', "Done! You're now booked for Wednesday at 11:00 AM."],
  ],
  [
    ['customer', 'Do you accept insurance?'],
    [
      'system',
      'We accept most major PPO plans. Could you share the name of your insurance provider so I can check?',
    ],
    ['customer', "I'd rather talk to a person about this, it's complicated."],
  ],
];

const now = Date.now();
const minutes = (n: number) => n * 60_000;
const id = (prefix: string, n: number) => `${prefix}-${String(n).padStart(4, '0')}-demo`;
const phone = (n: number) => `+1202555${String(100 + n).padStart(4, '0')}`;

const formatDateCreated = (ms: number) =>
  new Date(ms)
    .toISOString()
    .replace('T', ' ')
    .replace(/\.\d+Z$/, 'Z');

export interface MockDb {
  workspace: Workspace;
  clinic: Clinic;
  settings: ClinicSettings;
  quota: Quota;
  widgetInstalled: boolean;
  conversations: Conversation[];
  messages: Record<string, Message[]>;
  summaries: Record<string, { summary: string; updated_at: number }>;
  contacts: Contact[];
  campaigns: Campaign[];
  templates: Template[];
}

export const createSeed = (): MockDb => {
  const contacts: Contact[] = people.map(([first, last, type], i) => {
    const created = new Date(now - minutes(60 * 24 * (40 - i))).toISOString();
    return {
      id: id('contact', i),
      full_name: `${first} ${last}`,
      email: `${first}.${last}@example.com`.toLowerCase(),
      phone_number: phone(i),
      type,
      created_at: created,
      updated_at: created,
    };
  });

  const conversations: Conversation[] = [];
  const messages: Record<string, Message[]> = {};
  const summaries: MockDb['summaries'] = {};

  people.forEach(([first, lastName, type], i) => {
    const leadId = contacts[i].id;
    const script = scripts[i % scripts.length];
    const channel = i % 3 === 0 ? 'chat' : 'whatsapp';
    const startedAt = now - minutes(37 * i * i + 45 * i + 5);

    const thread: Message[] = script.map(([author, body], j) => {
      const ts = startedAt + minutes(j * 2);
      return {
        id: `${leadId}-m${j}`,
        author: author === 'system' ? 'system' : leadId,
        body,
        channel,
        status: author === 'system' ? 'read' : 'not_available',
        date_created: formatDateCreated(ts),
        date_created_timestamp: Math.floor(ts / 1000),
        is_channel_updated: false,
      };
    });
    const latest = thread[thread.length - 1];
    messages[leadId] = [...thread].reverse();

    const needsHuman = i % scripts.length === 1 || i % scripts.length === 5;
    conversations.push({
      lead_id: leadId,
      first_name: first,
      last_name: lastName,
      email: contacts[i].email,
      phone_number: contacts[i].phone_number,
      type,
      is_client: type === 'client',
      last_message_content: latest.body,
      last_message_timestamp: latest.date_created_timestamp,
      transferred_to_human: needsHuman,
      authenticated: true,
      free_message_allowed: i % 4 !== 3,
      created_at: new Date(startedAt).toISOString(),
    });

    summaries[leadId] = {
      summary: needsHuman
        ? `${first} asked a question the assistant could not resolve and requested a member of staff. Review the thread and reply directly.`
        : `${first} contacted the clinic via ${channel === 'chat' ? 'live chat' : 'WhatsApp'}. The assistant answered their questions and no follow-up is needed.`,
      updated_at: Math.floor(now / 1000),
    };
  });

  conversations.sort((a, b) => b.last_message_timestamp - a.last_message_timestamp);

  const templates: Template[] = [
    {
      id: id('template', 1),
      name: 'appointment_reminder',
      category: 'UTILITY',
      status: 'approved',
      message: 'Hi {{first_name}}, this is a reminder of your appointment tomorrow. Reply YES to confirm.',
      language: 'EN',
      auto_category: true,
      created_at: new Date(now - minutes(60 * 24 * 20)).toISOString(),
      updated_at: new Date(now - minutes(60 * 24 * 19)).toISOString(),
    },
    {
      id: id('template', 2),
      name: 'spring_promotion',
      category: 'MARKETING',
      status: 'approved',
      message: 'Hi {{first_name}}! Book any treatment this month and get 15% off your next visit.',
      language: 'EN',
      auto_category: true,
      created_at: new Date(now - minutes(60 * 24 * 12)).toISOString(),
      updated_at: new Date(now - minutes(60 * 24 * 11)).toISOString(),
    },
    {
      id: id('template', 3),
      name: 'follow_up_check_in',
      category: 'UTILITY',
      status: 'review',
      message:
        'Hi {{first_name}}, how are you feeling after your visit? Let us know if you have any questions.',
      language: 'EN',
      auto_category: false,
      created_at: new Date(now - minutes(60 * 24 * 2)).toISOString(),
      updated_at: new Date(now - minutes(60 * 24 * 2)).toISOString(),
    },
    {
      id: id('template', 4),
      name: 'new_location_announcement',
      category: 'MARKETING',
      status: 'draft',
      message: 'Hi {{first_name}}, we are opening a second location downtown next month!',
      language: 'EN',
      auto_category: true,
      created_at: new Date(now - minutes(60 * 5)).toISOString(),
      updated_at: new Date(now - minutes(60 * 5)).toISOString(),
    },
  ];

  const lead = (c: Contact) => ({ id: c.id, name: c.full_name, type: c.type, phone: c.phone_number });
  const campaignLeads = contacts.slice(0, 12).map(lead);
  const campaigns: Campaign[] = [
    {
      id: id('campaign', 1),
      name: 'Spring promotion',
      status: 'Sent',
      scheduled_time: new Date(now - minutes(60 * 24 * 9)).toISOString(),
      template_id: templates[1].id,
      leads: campaignLeads,
      statuses: campaignLeads.map((l, i) => ({ lead_id: l.id, status: i === 4 ? 'failed' : 'done' })),
      read: 9,
      replied: 4,
    },
    {
      id: id('campaign', 2),
      name: 'Appointment reminders, week 12',
      status: 'Active',
      scheduled_time: new Date(now + minutes(60 * 24 * 2)).toISOString(),
      template_id: templates[0].id,
      leads: contacts.slice(12, 18).map(lead),
      statuses: [],
      read: 0,
      replied: 0,
    },
  ];

  return {
    workspace: { id: 'workspace-demo', active: true, phone_number: '+12025550100' },
    clinic: {
      name: 'Northside Wellness Clinic',
      phone: '+12025550100',
      language: 'EN',
      url: 'https://example.com',
      website_last_crawled_at: new Date(now - minutes(60 * 24 * 3)).toISOString(),
      is_onboarded: true,
      waba_active: true,
      terms_accepted: true,
    },
    settings: {
      default_language: 'EN',
      timezone: 'America/New_York',
      email: 'frontdesk@example.com',
      live_chat_enabled: true,
      concierge_enabled: true,
      business_name: 'Northside Wellness Clinic',
      logo: null,
      default_currency: 'USD',
      website: 'https://example.com',
      whatsapp_chat_enabled: true,
      live_chat_pre_message: 'Hi! How can we help you today?',
      phone_number: '+12025550100',
      clinic_type: 'MEDSPA',
      additional_settings: '',
    },
    quota: {
      total: 1000,
      consumed: 812,
      on_demand_value: 0,
      subscription: {
        name: 'Growth',
        description: 'AI assistant on WhatsApp and live chat with up to 1,000 messages per month.',
        next_billing_date: new Date(now + minutes(60 * 24 * 11)).toISOString(),
        price: 199,
        on_demand_price: '$0.05 per message',
        interval: 'month',
        currency: 'usd',
      },
      near_limit: false,
      exceeded: false,
    },
    widgetInstalled: true,
    conversations,
    messages,
    summaries,
    contacts,
    campaigns,
    templates,
  };
};
