import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  confirmLabel?: string;
  isPending?: boolean;
}

const SwitchToManualChatModal = ({
  open,
  onOpenChange,
  onConfirm,
  confirmLabel = 'Switch to manual chat',
  isPending = false,
}: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent>
      <Image src="/starIcon.svg" alt="" width={56} height={56} className="mb-1" />
      <DialogTitle className="leading-6">Switch to manual chat?</DialogTitle>
      <div className="mb-4 text-base leading-6 text-primary-800">
        Auto-pilot will be deactivated and stop sending messages to the client. You will join the chat and
        take over the conversation.
      </div>
      <DialogFooter>
        <Button
          variant="outline"
          className="mt-4 w-full font-semibold lg:mt-0"
          onClick={() => onOpenChange(false)}
        >
          Keep auto-pilot
        </Button>
        <Button className="w-full font-semibold" autoFocus onClick={onConfirm} disabled={isPending}>
          {confirmLabel}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default SwitchToManualChatModal;
