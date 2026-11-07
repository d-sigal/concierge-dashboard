'use client';

import { useState } from 'react';
import Image from 'next/image';
import { DoubleArrowsIcon } from '@/components/icons/DoubleArrowsIcon';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import type { ChannelKey } from '@/lib/api/types';
import { CHANNEL_OPTIONS, getChannelOption } from '@/lib/channels';
import { cn } from '@/lib/utils';

interface Props {
  value: ChannelKey;
  onChange: (channel: ChannelKey) => void;
  /** Collapse to the icon while the user is typing, expanding on hover. */
  isCompact: boolean;
}

const ChannelSelector = ({ value, onChange, isCompact }: Props) => {
  const [isOpen, setOpen] = useState(false);
  const selected = getChannelOption(value) ?? CHANNEL_OPTIONS[0];
  const compactClassName = !isOpen && isCompact ? 'hidden group-hover:block' : '';

  return (
    <Select
      value={selected.value}
      onValueChange={(channel) => onChange(channel as ChannelKey)}
      open={isOpen}
      onOpenChange={setOpen}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <SelectTrigger
            className={cn(
              isOpen && 'bg-text-active',
              'group flex max-h-6 w-max justify-between rounded border-none p-1 transition-colors hover:bg-brand-50 focus:outline-none focus:ring-0 focus:ring-offset-0 [&>svg:last-child]:hidden',
            )}
          >
            <Image src={selected.icon} alt="" width={16} height={16} />
            <p className={cn('ml-1 text-[13px] font-semibold text-text-secondary', compactClassName)}>
              {selected.title}
            </p>
            <DoubleArrowsIcon className={compactClassName} />
          </SelectTrigger>
        </TooltipTrigger>
        <TooltipContent className="rounded-lg bg-basic px-3 py-2 text-white">
          {selected.tooltip}
        </TooltipContent>
      </Tooltip>
      <SelectContent className="rounded-lg border border-primary-600 p-0 shadow-channelSelector">
        {CHANNEL_OPTIONS.map(({ icon, value: optionValue, title }) => (
          <SelectItem
            className="group flex min-w-[180px] justify-between p-2 hover:cursor-pointer [&>span:first-child]:w-full [&>span:last-child]:hidden"
            value={optionValue}
            key={optionValue}
          >
            <div className="flex w-full items-center justify-between">
              <div className="flex items-center justify-between gap-2 rounded-lg transition-colors hover:bg-brand-50">
                <Image src={icon} alt="" width={16} height={16} />
                <p className="text-sm text-text-disabled transition-colors group-hover:text-basic">{title}</p>
              </div>
              {selected.value === optionValue && (
                <Image src="/selectedIcon.svg" alt="Selected" width={20} height={20} />
              )}
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default ChannelSelector;
