'use client';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import React from 'react';
import { FormField } from '@/components/ui/form';
import { CaretDown, CaretUp, CheckCircle } from '@phosphor-icons/react';

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  name: string;
  label?: string;
  placeholder?: string;
  width?: string;
  className?: string;
  disabled?: boolean;
  defaultValue?: string;
}

const SearchSelect = ({
  options,
  name,
  label,
  placeholder = 'Select option',
  width = 'w-full lg:w-[464px]',
  className,
  disabled = false,
  defaultValue,
}: SelectProps) => {
  const [open, setOpen] = React.useState(false);

  return (
    <div className={className}>
      {label && <div className="mb-1 text-sm font-medium text-primary-800">{label}</div>}
      <FormField
        name={name}
        defaultValue={defaultValue}
        render={({ field }) => {
          const selected = options.find((option) => option.value === field.value);

          return (
            <Popover open={open} onOpenChange={setOpen} modal={true}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  disabled={disabled}
                  className={cn(
                    `group ${width} justify-between rounded-lg border-brand-300 bg-transparent px-5 text-gray-500 transition-all hover:border-brand-400`,
                    open && 'border-brand-500',
                    field.value && 'border-brand-300 text-basic',
                    disabled && 'cursor-not-allowed opacity-50',
                  )}
                >
                  <span className="overflow-hidden overflow-ellipsis">
                    {selected ? selected.label : placeholder}
                  </span>
                  {open ? (
                    <CaretUp className="ml-auto h-4 w-4 text-icon" />
                  ) : (
                    <CaretDown className="ml-auto h-4 w-4 text-icon" />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className={`${width} rounded-lg p-0`}>
                <Command>
                  <CommandInput className="h-9" placeholder={`Search ${label || 'options'}...`} />
                  <CommandList>
                    <CommandGroup>
                      {options.map((option) => (
                        <CommandItem
                          key={option.label}
                          value={option.label}
                          onSelect={() => {
                            field.onChange(option.value);
                            setOpen(false);
                          }}
                        >
                          {option.label}

                          {field.value === option.value && (
                            <CheckCircle size={20} className="ml-auto text-brand-400" />
                          )}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </div>
  );
};

export default SearchSelect;
