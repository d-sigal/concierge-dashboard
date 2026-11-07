import { format, isToday, isYesterday, parse } from 'date-fns';
import type { Conversation } from '@/lib/api/types';

export const getConversationDetails = (conversation: Conversation | undefined) => {
  const { first_name, last_name, phone_number, lead_id } = conversation ?? {};

  const userInitials = `${first_name?.[0] ?? ''}${last_name?.[0] ?? ''}`.toUpperCase();
  const userDisplayName =
    first_name || last_name
      ? [first_name, last_name].filter(Boolean).join(' ')
      : (phone_number ?? lead_id ?? '');

  return { userInitials, userDisplayName };
};

/** Initials for a free-form full name, e.g. "Jane Doe" -> "JD". */
export const getInitials = (fullName: string | null | undefined) => {
  const [first, second] = (fullName ?? '').trim().split(/\s+/);
  return `${first?.[0] ?? ''}${second?.[0] ?? ''}`.toUpperCase();
};

/** "Today", "Yesterday" or e.g. "Thu, November 7th" for a message `date_created` string. */
export const getDateLabel = (dateCreated: string) => {
  const date = parse(dateCreated, 'yyyy-MM-dd HH:mm:ssX', new Date());

  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEE, MMMM do');
};

/** Calendar day of a message `date_created` string (`yyyy-MM-dd`). */
export const getMessageDay = (dateCreated: string) => dateCreated.slice(0, 10);

/** 24h `HH:mm` in local time for a Unix timestamp in seconds. */
export const formatTime = (epochSeconds: number) =>
  new Date(epochSeconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

/** Inbox list timestamp: time for today, "Yesterday", otherwise a short date. */
export const formatConversationTimestamp = (epochSeconds: number) => {
  const date = new Date(epochSeconds * 1000);

  if (isToday(date)) return formatTime(epochSeconds);
  if (isYesterday(date)) return 'Yesterday';
  return date.toLocaleDateString(undefined, { day: '2-digit', month: '2-digit', year: 'numeric' });
};
