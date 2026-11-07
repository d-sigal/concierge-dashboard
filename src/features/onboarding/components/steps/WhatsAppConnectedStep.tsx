'use client';

import { CheckIcon } from 'lucide-react';
import { CheckCircle, Copy, Prohibit, WhatsappLogo } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { brand } from '@/config/brand';
import { useCopyToClipboard } from '@/features/onboarding/hooks';
import { useClinic, useWorkspace } from '@/features/workspace/hooks';

const SUPPORTED = [
  { title: 'WhatsApp messaging', content: 'Customers can send and receive messages on WhatsApp.' },
  {
    title: `${brand.name} dashboard`,
    content: `You can view and reply to chats only in the ${brand.name} dashboard.`,
  },
];

const UNSUPPORTED = [
  {
    title: 'WhatsApp Business app',
    content: 'This number cannot be connected to the WhatsApp Business app.',
  },
  { title: 'Phone calls', content: 'This number cannot make or receive phone calls.' },
  { title: 'SMS', content: 'This number does not support text messaging.' },
];

const PhoneInfoCard = ({ title, content }: { title: string; content: string }) => (
  <div className="rounded-lg border border-strokes-blocks px-4 py-3 text-sm">
    <h2 className="mb-1 font-semibold lg:font-bold">{title}</h2>
    <p className="font-medium text-text-secondary">{content}</p>
  </div>
);

const WhatsAppConnectedStep = ({ onConfirm }: { onConfirm: () => void }) => {
  const { data: workspace } = useWorkspace();
  const { data: clinic } = useClinic();
  const { copiedKey, copy } = useCopyToClipboard<'phone'>();
  const phoneNumber = workspace?.phone_number ?? clinic?.phone;

  return (
    <DialogContent
      closeIconClassName="hidden"
      className="p-6 md:max-w-[680px] md:p-8 lg:max-w-[680px]"
      onEscapeKeyDown={(e) => e.preventDefault()}
      onInteractOutside={(e) => e.preventDefault()}
      aria-describedby={undefined}
    >
      <div>
        <DialogTitle asChild>
          <h1 className="mb-4 text-xl font-bold">WhatsApp for Business is now connected</h1>
        </DialogTitle>

        <p className="mb-4 text-sm font-medium">Your dedicated WhatsApp number is:</p>
        <div className="mb-8 flex items-center justify-between rounded-lg border border-strokes-blocks bg-brand-50 p-6 font-medium lg:mb-10">
          <div className="flex w-full items-center gap-x-5">
            <div className="inline-block rounded-full bg-[#00D95F] p-1">
              <WhatsappLogo className="size-4 text-white" />
            </div>
            {phoneNumber && (
              <>
                <p className="font-semibold lg:font-bold">{phoneNumber}</p>
                <Button
                  variant="text"
                  className="ml-auto gap-x-2.5"
                  size="auto"
                  onClick={() => copy('phone', phoneNumber)}
                >
                  <span className="hidden md:block">Copy number</span>
                  {copiedKey === 'phone' ? <CheckIcon size={20} /> : <Copy size={20} />}
                </Button>
              </>
            )}
          </div>
        </div>

        <p className="mb-4 flex items-center">
          <CheckCircle weight="fill" className="mr-2 text-brand-800" size={22} /> What this number can do:
        </p>
        <div className="mb-8 grid gap-3 md:grid-cols-2">
          {SUPPORTED.map((item) => (
            <PhoneInfoCard key={item.title} {...item} />
          ))}
        </div>

        <p className="mb-4 flex items-center">
          <Prohibit weight="fill" className="mr-2 text-strokes-alert" size={22} /> What this number does not
          support:
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {UNSUPPORTED.map((item) => (
            <PhoneInfoCard key={item.title} {...item} />
          ))}
        </div>

        <div className="mt-8 items-center md:mt-20 md:flex">
          {brand.supportEmail && (
            <p className="mb-6 text-sm md:mb-0">
              For any questions or concerns, contact us at{' '}
              <a href={`mailto:${brand.supportEmail}`}>
                <strong>{brand.supportEmail}</strong>
              </a>
            </p>
          )}
          <Button className="w-full md:ml-auto md:w-auto" onClick={onConfirm}>
            Got it
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default WhatsAppConnectedStep;
