import { Button } from '@/components/ui/button';
import { SETTINGS_FORM_ID } from '@/features/settings/utils';

interface Props {
  onDiscard: () => void;
  isSaving?: boolean;
}

const SaveSettingsFooter = ({ onDiscard, isSaving }: Props) => (
  <div className="sticky bottom-0 z-50 mt-auto flex items-center justify-between gap-x-2 border-t border-t-gray-100 bg-gray-50 pt-4">
    <Button
      type="button"
      variant="secondary"
      className="w-full md:w-auto"
      onClick={onDiscard}
      disabled={isSaving}
    >
      Discard
    </Button>
    <Button type="submit" form={SETTINGS_FORM_ID} className="w-full md:w-auto" disabled={isSaving}>
      Save changes
    </Button>
  </div>
);

export default SaveSettingsFooter;
