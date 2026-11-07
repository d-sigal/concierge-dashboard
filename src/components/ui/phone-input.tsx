'use client';

import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { ChevronDown, Phone } from 'lucide-react';
import React, { forwardRef } from 'react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';

const PhoneInput = forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => {
    return (
      <Input
        className={cn(
          '-ms-px rounded-r-lg rounded-s-none border-none pl-2 font-medium shadow-none ring-0 focus-visible:z-10 disabled:pointer-events-none disabled:border-gray-200 disabled:bg-gray-50',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);

PhoneInput.displayName = 'PhoneInput';

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (value: RPNInput.Country) => void;
  options: { label: string; value: RPNInput.Country | undefined }[];
};

const CountrySelect = ({ disabled, value, onChange, options }: CountrySelectProps) => {
  const handleSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value as RPNInput.Country);
  };

  return (
    <div className="bg-background flag-wrapper relative inline-flex items-center self-stretch rounded-s-lg py-2 pe-2 ps-3 transition-shadow has-[:disabled]:pointer-events-none has-[:disabled]:border-r-0">
      <div className="inline-flex items-center gap-1" aria-hidden="true">
        <FlagComponent country={value} countryName={value} aria-hidden="true" />
        {!disabled && (
          <span className="text-muted-foreground/80">
            <ChevronDown size={16} strokeWidth={2} aria-hidden="true" />
          </span>
        )}
      </div>
      <select
        disabled={disabled}
        value={value}
        onChange={handleSelect}
        className="absolute inset-0 text-sm opacity-0"
      >
        <option key="default" value="">
          Select a country
        </option>
        {options
          .filter((x) => x.value)
          .map((option, i) => (
            <option key={option.value ?? `empty-${i}`} value={option.value}>
              {option.label} {option.value && `+${RPNInput.getCountryCallingCode(option.value)}`}
            </option>
          ))}
      </select>
    </div>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="w-5 overflow-hidden rounded-[2px]">
      {Flag ? <Flag title={countryName} /> : <Phone size={16} aria-hidden="true" />}
    </span>
  );
};

interface Props {
  id: string;
  value: any;
  onChange?: (value: any) => void;
  className?: string;
  disabled?: boolean;
  errorClassName?: string;
}

export const ReactPhoneInput = ({
  id,
  value,
  onChange = () => {},
  className = '',
  errorClassName,
  disabled,
}: Props) => {
  return (
    <div className={cn(className)}>
      <RPNInput.default
        className={cn('group flex rounded-lg', errorClassName)}
        international
        flagComponent={FlagComponent}
        countrySelectComponent={CountrySelect}
        inputComponent={PhoneInput}
        id={id}
        placeholder="Enter phone number"
        value={value}
        onChange={onChange}
        disabled={disabled}
      />
    </div>
  );
};
