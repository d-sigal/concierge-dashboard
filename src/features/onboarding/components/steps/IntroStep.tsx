import { CaretRight, ChatsCircle } from '@phosphor-icons/react';
import Illustration from '@/components/common/Illustration';
import { Button } from '@/components/ui/button';
import { DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { brand } from '@/config/brand';

const IntroStep = ({ onStart }: { onStart: () => void }) => (
  <DialogContent
    closeIconClassName="hidden"
    className="px-8 pb-8 pt-0 md:max-w-[400px] lg:max-w-[460px]"
    aria-describedby={undefined}
  >
    <div className="mb-4 text-center">
      <Illustration icon={ChatsCircle} className="-mx-8 mb-10 h-[184px] rounded-xl" iconClassName="size-20" />
      <DialogTitle asChild>
        <h1 className="mb-4 text-2lg font-bold lg:text-2xl">Welcome to {brand.name}</h1>
      </DialogTitle>
      <p className="text-sm font-medium lg:text-base">
        Finalize your setup to unlock {brand.assistantName} for your customers.
      </p>
    </div>
    <DialogFooter>
      <Button
        className="mx-auto flex w-full items-center gap-x-2 rounded-lg py-2.5 font-semibold lg:w-auto"
        onClick={onStart}
      >
        Get started <CaretRight size={20} />
      </Button>
    </DialogFooter>
  </DialogContent>
);

export default IntroStep;
