import type { TemplateListParams } from '@/lib/api/types';

/**
 * Every React Query key in the app. Use these instead of inline arrays so
 * invalidation and optimistic updates always target the right cache entries.
 */
export const queryKeys = {
  workspace: ['workspace'] as const,
  clinic: ['clinic'] as const,
  settings: ['settings'] as const,
  quota: ['quota'] as const,
  widget: {
    snippet: ['widget', 'snippet'] as const,
    status: ['widget', 'status'] as const,
  },
  conversations: {
    all: ['conversations'] as const,
    lists: ['conversations', 'list'] as const,
    list: (filter: { assistNeeded: boolean; search: string | null }) =>
      ['conversations', 'list', filter] as const,
    detail: (leadId: string) => ['conversations', 'detail', leadId] as const,
    metrics: ['conversations', 'metrics'] as const,
    messages: (leadId: string) => ['conversations', 'messages', leadId] as const,
    summary: (leadId: string) => ['conversations', 'summary', leadId] as const,
  },
  contacts: ['contacts'] as const,
  campaigns: ['campaigns'] as const,
  templates: {
    all: ['templates'] as const,
    list: (params: TemplateListParams = {}) => ['templates', params] as const,
  },
};
