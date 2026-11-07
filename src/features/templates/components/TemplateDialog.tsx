'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { X } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerClose, DrawerContent, DrawerTitle } from '@/components/ui/drawer';
import { Form } from '@/components/ui/form';
import { LANGUAGES } from '@/lib/constants';
import { useClinic } from '@/features/workspace/hooks';
import TemplateForm, {
  TemplateFormPreview,
  type TemplateFormValues,
} from '@/features/templates/components/TemplateForm';

/** Maps the clinic language (code or label) to a value of the language picker. */
const toLanguageValue = (language?: string | null) => {
  const normalized = language?.trim().toLowerCase();
  if (!normalized) return '';
  const match = LANGUAGES.find(
    ({ label, value }) => value.toLowerCase() === normalized || label.toLowerCase() === normalized,
  );
  return match?.value ?? '';
};

const TemplateDialogBody = ({ onClose }: { onClose: () => void }) => {
  const { data: clinic } = useClinic();

  const form = useForm<TemplateFormValues>({
    defaultValues: {
      name: '',
      category: 'utility',
      language: toLanguageValue(clinic?.language),
      message: '',
      auto_category: true,
    },
  });

  const clinicLanguage = toLanguageValue(clinic?.language);
  const { getValues, setValue } = form;
  useEffect(() => {
    // The clinic may load after the drawer opens; only prefill if the user hasn't picked a language.
    if (clinicLanguage && !getValues('language')) setValue('language', clinicLanguage);
  }, [clinicLanguage, getValues, setValue]);

  return (
    <Form {...form}>
      <Button
        variant="icon"
        size="icon"
        onClick={onClose}
        className="absolute right-[calc(100%+16px)] top-4"
        aria-label="Close"
      >
        <X size={20} />
      </Button>
      <div className="flex h-full">
        <div className="flex w-full flex-col p-5 md:p-6">
          <DrawerTitle className="mb-8 flex items-center text-lg font-semibold">
            Create a new WhatsApp template
            <DrawerClose className="ml-auto lg:hidden" aria-label="Close">
              <X size={20} className="text-brand-600" />
            </DrawerClose>
          </DrawerTitle>
          <TemplateForm onClose={onClose} />
        </div>
        <TemplateFormPreview />
      </div>
    </Form>
  );
};

interface Props {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** Right-hand drawer for creating a WhatsApp template and submitting it for Meta review. */
const TemplateDialog = ({ open, onOpenChange }: Props) => (
  <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
    <DrawerContent className="ml-auto h-full max-w-[992px] rounded-tr-none">
      <TemplateDialogBody onClose={() => onOpenChange?.(false)} />
    </DrawerContent>
  </Drawer>
);

export default TemplateDialog;
