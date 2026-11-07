'use client';

import { useState } from 'react';
import { Plus } from '@phosphor-icons/react';
import PageTitle from '@/components/common/PageTitle';
import { Button } from '@/components/ui/button';
import { useTemplates } from '@/features/templates/hooks';
import CreateTemplateBanner from '@/features/templates/components/CreateTemplateBanner';
import TemplateDialog from '@/features/templates/components/TemplateDialog';
import TemplatesInfo from '@/features/templates/components/TemplatesInfo';
import TemplatesTable from '@/features/templates/components/TemplatesTable';

const TemplatesPage = () => {
  const { data: templates = [] } = useTemplates();
  const [createOpen, setCreateOpen] = useState(false);

  return (
    <>
      <PageTitle className="flex w-full">
        <div className="flex flex-shrink-0 items-center gap-x-3">
          WhatsApp templates
          <div className="grid size-6 shrink-0 place-items-center items-center rounded-full bg-white text-[13px] font-semibold leading-none">
            {templates.length}
          </div>
        </div>
        <Button variant="text" className="ml-auto p-0" size="auto" onClick={() => setCreateOpen(true)}>
          Create <Plus className="ml-1 size-5" />
        </Button>
      </PageTitle>
      <TemplatesTable data={templates} />
      <TemplateDialog open={createOpen} onOpenChange={setCreateOpen} />
      <TemplatesInfo />
      <CreateTemplateBanner onClick={() => setCreateOpen(true)} />
    </>
  );
};

export default TemplatesPage;
