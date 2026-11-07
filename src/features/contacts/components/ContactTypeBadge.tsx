import type { ContactType } from '@/lib/api/types';
import { cn } from '@/lib/utils';

interface Props {
  type: ContactType;
  className?: string;
}

const ContactTypeBadge = ({ type, className }: Props) => (
  <div
    className={cn(
      'w-fit rounded-full px-3 py-2 text-[13px] font-semibold capitalize leading-tight',
      type === 'lead' ? 'bg-yellow-300' : 'bg-green-300',
      className,
    )}
  >
    {type}
  </div>
);

export default ContactTypeBadge;
