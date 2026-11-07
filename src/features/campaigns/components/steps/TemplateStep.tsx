'use client';

import { useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { FilePlus, FileText } from '@phosphor-icons/react';
import SelectableArea from '@/components/common/SelectableArea';
import { DrawerTitle } from '@/components/ui/drawer';
import { FormField, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Template } from '@/lib/api/types';
import TemplateDialog from '@/features/templates/components/TemplateDialog';
import type { CampaignFormValues } from '@/features/campaigns/form';

const TemplateStep = ({ templates }: { templates: Template[] }) => {
  const { control, setValue, clearErrors, formState } = useFormContext<CampaignFormValues>();
  const templateSource = useWatch({ control, name: 'templateSource' });
  const [createOpen, setCreateOpen] = useState(false);

  const onCreateOpenChange = (open: boolean) => {
    setCreateOpen(open);
    // New templates need Meta's approval before they can be used, so go back to the list.
    if (!open) setValue('templateSource', 'existing');
  };

  return (
    <>
      <DrawerTitle className="mb-6 text-lg font-semibold">Choose template</DrawerTitle>
      <FormField
        control={control}
        name="templateSource"
        render={({ field }) => (
          <RadioGroup
            value={field.value}
            onValueChange={(value: CampaignFormValues['templateSource']) => {
              field.onChange(value);
              setValue('templateId', '');
              if (value === 'new') setCreateOpen(true);
            }}
            className="mb-12"
          >
            <SelectableArea
              id="existing"
              value="existing"
              icon={<FileText size={16} className="text-brand-600" />}
              title="Choose from the list"
              description="Choose a template approved by Meta from your list."
            >
              {templateSource === 'existing' && (
                <div>
                  <FormLabel htmlFor="templateId" className="block">
                    WhatsApp marketing template
                  </FormLabel>
                  <FormField
                    control={control}
                    name="templateId"
                    rules={{ required: 'Choose a template to proceed.' }}
                    render={({ field: templateField }) => (
                      <>
                        <Select
                          value={templateField.value}
                          onValueChange={(templateId) => {
                            templateField.onChange(templateId);
                            clearErrors('templateId');
                          }}
                        >
                          <SelectTrigger hasError={!!formState.errors.templateId}>
                            <SelectValue id="templateId" placeholder="Choose template" />
                          </SelectTrigger>
                          <SelectContent>
                            {templates.map(({ id, name }) => (
                              <SelectItem value={id} key={id}>
                                {name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </>
                    )}
                  />
                </div>
              )}
            </SelectableArea>
            <SelectableArea
              id="new"
              value="new"
              icon={<FilePlus size={16} className="text-brand-600" />}
              title="Create new template"
              description="Please note that Meta's approval is required to use the template. The approval process can take anywhere from 2 minutes to 24 hours."
            />
          </RadioGroup>
        )}
      />
      <TemplateDialog open={createOpen} onOpenChange={onCreateOpenChange} />
    </>
  );
};

export default TemplateStep;
