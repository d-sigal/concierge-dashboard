'use client';

import { useState } from 'react';
import { Info, X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

const TemplatesInfo = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="mb-4 mt-6 w-full">
      {open ? (
        <div className="relative mt-3 rounded-lg border border-strokes-info bg-surface-info p-6">
          <Button
            className="absolute right-4 top-4 h-auto p-0"
            variant="text"
            onClick={() => setOpen(false)}
            aria-label="Close"
          >
            <X className="size-5 text-brand-600" />
          </Button>
          <h4 className="mb-5 grid items-center gap-x-3 font-bold md:grid-cols-[18px_1fr]">
            <Info className="mb-2 size-5 text-blue-600 md:mb-0" />
            <span>What are templates and why do you need them?</span>
          </h4>
          <p className="font-medium">
            WhatsApp requires approved message templates for sending messages outside the 24-hour window after
            a customer&rsquo;s last response. These templates help ensure compliance with Meta&rsquo;s rules
            and keep messaging smooth and reliable.
          </p>
        </div>
      ) : (
        <Button
          variant="text"
          className="gap-x-1 p-0 text-brand-800"
          size="auto"
          onClick={() => setOpen(true)}
        >
          <Info className="mr-1.5 size-5 text-blue-600" />
          What are templates?
        </Button>
      )}
    </div>
  );
};

export default TemplatesInfo;
