import type { ChannelKey } from '@/lib/api/types';

export const WHATSAPP: ChannelKey = 'whatsapp';
export const LIVE_CHAT: ChannelKey = 'chat';

export interface ChannelOption {
  value: ChannelKey;
  title: string;
  tooltip: string;
  icon: string;
}

export const CHANNEL_OPTIONS: ChannelOption[] = [
  { value: WHATSAPP, title: 'WhatsApp', tooltip: 'Reply on WhatsApp', icon: '/whatsAppIcon.svg' },
  { value: LIVE_CHAT, title: 'Live chat', tooltip: 'Reply on live chat', icon: '/liveChatIcon.svg' },
];

export const getChannelOption = (channel: string | null | undefined) =>
  CHANNEL_OPTIONS.find((option) => option.value === channel);
