'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

const DemoModeBadge = () => (
  <Tooltip delayDuration={200}>
    <TooltipTrigger asChild>
      <span
        tabIndex={0}
        className="ml-3 cursor-default rounded-full border border-brand-300 bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800"
      >
        Demo mode
      </span>
    </TooltipTrigger>
    <TooltipContent side="bottom">Data is fake and resets on reload</TooltipContent>
  </Tooltip>
);

export default DemoModeBadge;
