import type { ReactNode } from 'react';
import Image from 'next/image';
import { CaretRight, ChatsTeardrop } from '@phosphor-icons/react';
import Illustration from '@/components/common/Illustration';
import WhatsApp from '@/components/icons/WhatsApp';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogTitle } from '@/components/ui/dialog';
import { brand } from '@/config/brand';
import { cn } from '@/lib/utils';

interface Props {
  onNotNow: () => void;
  onSelectWhatsApp: () => void;
  onSelectLiveChat: () => void;
}

const ChannelOption = ({
  onClick,
  className,
  children,
}: {
  onClick: () => void;
  className?: string;
  children: ReactNode;
}) => (
  <button
    type="button"
    className={cn(
      'group flex w-full cursor-pointer items-center rounded-lg border border-strokes px-5 py-6 text-left transition-colors hover:border-brand-400',
      className,
    )}
    onClick={onClick}
  >
    <span className="flex items-center gap-x-3 font-bold leading-none">{children}</span>
    <CaretRight className="ml-auto text-icon transition-colors group-hover:text-brand-800" />
  </button>
);

const NotNowButton = ({ onClick, className }: { onClick: () => void; className: string }) => (
  <Button variant="ghost" size="auto" onClick={onClick} className={cn('ml-auto h-auto text-sm', className)}>
    Not now <CaretRight size={20} className="ml-2" />
  </Button>
);

const ChannelsStep = ({ onNotNow, onSelectWhatsApp, onSelectLiveChat }: Props) => (
  <DialogContent
    closeIconClassName="hidden"
    className="border-basic-blocks p-6 sm:rounded-xl md:max-w-[680px] lg:max-w-[800px] lg:p-8"
    aria-describedby={undefined}
  >
    <div className="flex grid-cols-[320px_1fr] flex-col gap-x-8 lg:grid">
      <NotNowButton onClick={onNotNow} className="mb-4 lg:hidden" />
      <Illustration icon={ChatsTeardrop} className="mb-8 min-h-[188px] rounded-lg lg:mb-0" />
      <div className="flex flex-col">
        <NotNowButton onClick={onNotNow} className="mb-6 hidden lg:flex" />
        <DialogTitle asChild>
          <h1 className="mb-3 text-xl font-bold">
            Activate {brand.assistantName} on at least one communication channel
          </h1>
        </DialogTitle>
        <p className="mb-6 text-sm font-medium">
          Automate customer communication by activating <br /> {brand.assistantName} on WhatsApp, live chat or
          both.
        </p>
        <div className="space-y-2">
          <ChannelOption className="relative" onClick={onSelectWhatsApp}>
            <Badge variant="recommended" className="absolute -top-2 left-5 py-1">
              Recommended
            </Badge>
            WhatsApp for Business <WhatsApp />
          </ChannelOption>
          <ChannelOption onClick={onSelectLiveChat}>
            Live chat on your website <Image src="/widgetIcon.svg" width={15} height={15} alt="" />
          </ChannelOption>
        </div>
      </div>
    </div>
  </DialogContent>
);

export default ChannelsStep;
