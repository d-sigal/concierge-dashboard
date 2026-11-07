// components/ui/SwitchWithSpinner.tsx
'use client';

import { motion } from 'framer-motion';
import ClipLoader from 'react-spinners/ClipLoader';
import { cn } from '@/lib/utils';

interface SwitchWithSpinnerProps {
  checked: boolean;
  onChange: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export const SwitchWithSpinner = ({
  checked,
  onChange,
  isLoading = false,
  disabled = false,
  className,
}: SwitchWithSpinnerProps) => {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
        checked ? 'bg-[#2A4038]' : 'bg-gray-300',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
    >
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        className={cn(
          'flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-sm transition-transform',
          checked ? 'translate-x-[20px]' : 'translate-x-[2px]',
        )}
      >
        {isLoading && <ClipLoader size={10} color="#6B7280" />}
      </motion.div>
    </button>
  );
};
