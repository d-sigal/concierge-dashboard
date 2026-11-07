import { Trash } from '@phosphor-icons/react';
import DialogIcon from '@/components/common/DialogIcon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  onConfirm: () => void;
  isPending?: boolean;
}

const ConfirmDeleteDialog = ({ open, onOpenChange, title, onConfirm, isPending }: Props) => (
  <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="lg:max-w-[428px]">
      <DialogTitle className="mb-2">
        <DialogIcon variant="destructive">
          <Trash size={20} />
        </DialogIcon>
        {title}
      </DialogTitle>
      <DialogFooter>
        <Button variant="outline" className="w-full" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button variant="destructive" className="w-full" onClick={onConfirm} disabled={isPending}>
          Delete
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export default ConfirmDeleteDialog;
