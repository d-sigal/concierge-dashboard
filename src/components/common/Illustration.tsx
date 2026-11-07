import type { Icon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

interface Props {
  icon: Icon;
  className?: string;
  /** Tailwind size class for the icon, e.g. `size-16`. */
  iconClassName?: string;
}

/**
 * Theme-aware placeholder for decorative artwork (onboarding, empty states).
 * Swap for your own images if you have them.
 */
const Illustration = ({ icon: IconComponent, className, iconClassName }: Props) => (
  <div
    aria-hidden="true"
    className={cn(
      'flex items-center justify-center overflow-hidden bg-gradient-to-br from-brand-100 via-brand-50 to-brand-200',
      className,
    )}
  >
    <IconComponent weight="duotone" className={cn('size-16 text-brand-600', iconClassName)} />
  </div>
);

export default Illustration;
