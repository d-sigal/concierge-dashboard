import * as React from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, hasError, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'focus-visible::border-brand-500 flex h-10 w-full rounded-md border border-brand-300 bg-transparent px-5 py-2 text-sm text-basic outline-0 transition file:border-0 file:bg-transparent placeholder:text-gray-500 focus-within:border-brand-500 hover:border-brand-400 focus:border-brand-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 [&:not(:placeholder-shown)]:text-basic',
          hasError && 'border-red-400',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
