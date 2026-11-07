import type { ReactNode } from 'react';
import { Check, Clock, XCircle } from '@phosphor-icons/react';
import type { MessageStatus } from '@/lib/api/types';
import { cn } from '@/lib/utils';

const DoubleCheck = ({ className }: { className: string }) => (
  <span className="relative inline-block w-[18px]">
    <Check weight="bold" size={16} className={cn('absolute left-0 top-0', className)} />
    <Check weight="bold" size={16} className={cn('absolute left-2 top-0', className)} />
  </span>
);

const STATUS_DISPLAY: Record<
  Exclude<MessageStatus, 'not_available'>,
  { icon: ReactNode; label: string; color: string }
> = {
  pending: { icon: <Clock weight="bold" size={16} />, label: 'Pending', color: 'text-gray-400' },
  sent: { icon: <Check weight="bold" size={16} />, label: 'Sent', color: 'text-gray-400' },
  delivered: { icon: <DoubleCheck className="text-gray-400" />, label: 'Delivered', color: 'text-gray-400' },
  read: { icon: <DoubleCheck className="text-blue-500" />, label: 'Read', color: 'text-blue-500' },
  undelivered: { icon: <XCircle weight="bold" size={16} />, label: 'Undelivered', color: 'text-yellow-500' },
  failed: { icon: <XCircle weight="bold" size={16} />, label: 'Failed', color: 'text-red-500' },
};

const MessageStatusIcon = ({ status }: { status: MessageStatus }) => {
  if (status === 'not_available') return null;

  const { icon, label, color } = STATUS_DISPLAY[status] ?? STATUS_DISPLAY.pending;
  return (
    <span className={cn('flex items-center', color)} title={label}>
      {icon}
    </span>
  );
};

export default MessageStatusIcon;
