'use client';

import { useMemo, useState } from 'react';
import { FolderOpen, Plus } from '@phosphor-icons/react';
import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import type { Template } from '@/lib/api/types';
import { cn } from '@/lib/utils';
import { useTemplates } from '@/features/templates/hooks';
import TemplateDialog from '@/features/templates/components/TemplateDialog';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (template: Template) => void;
  leadId: string;
}

/** Approved WhatsApp templates for a conversation, browsable by category and searchable. */
const TemplatePicker = ({ open, onOpenChange, onSelect, leadId }: Props) => {
  const { data: templates = [] } = useTemplates({ lead_id: leadId, status: 'approved' });
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [preview, setPreview] = useState('');

  const templatesByCategory = useMemo(() => {
    const groups = new Map<string, Template[]>();
    for (const template of templates) {
      groups.set(template.category, [...(groups.get(template.category) ?? []), template]);
    }
    return new Map([...groups].sort(([a], [b]) => b.localeCompare(a)));
  }, [templates]);

  const visibleTemplates = selectedCategory ? (templatesByCategory.get(selectedCategory) ?? []) : templates;
  const isBrowsingCategories = !selectedCategory && !search;

  const backToCategories = () => {
    setSelectedCategory(null);
    setSearch('');
  };

  return (
    <>
      <Popover open={open} onOpenChange={onOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="text"
            tabIndex={-1}
            aria-hidden
            className="ml-6 h-px w-px justify-start p-0 opacity-0"
          />
        </PopoverTrigger>

        <PopoverContent className="p-0" side="bottom" align="start">
          {preview && (
            <div className="absolute left-full top-0 ml-1 w-[275px] rounded-lg bg-[#EFE7DE] p-4 shadow-[0_6px_14px_-4px_#0E192733,0_4px_6px_-2px_#0E19270D]">
              <div className="rounded bg-[#F9F9F9] p-1.5 text-sm shadow-[0_1px_3px_0px_#081A0433]">
                {preview}
              </div>
            </div>
          )}

          <Command className="relative">
            {selectedCategory && (
              <button
                type="button"
                className="flex cursor-pointer items-center gap-x-3 p-2 font-bold text-basic"
                onClick={backToCategories}
              >
                <ChevronLeft className="text-icon" />
                <span className="first-letter:uppercase">{selectedCategory} templates</span>
              </button>
            )}
            <CommandInput value={search} onValueChange={setSearch} />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {isBrowsingCategories &&
                  [...templatesByCategory].map(([category, categoryTemplates]) => (
                    <CommandItem
                      key={category}
                      value={`category:${category}`}
                      className="mb-2 grid grid-cols-[20px_1fr] items-center gap-x-2 px-2 text-sm font-medium"
                      onSelect={() => setSelectedCategory(category)}
                    >
                      <FolderOpen size={22} className="!w-5 !bg-transparent !text-icon-light" />
                      <div>
                        <span className="block capitalize text-basic">{category}</span>
                        <span className="block text-text-description">
                          {categoryTemplates.length} templates
                        </span>
                      </div>
                    </CommandItem>
                  ))}
                {visibleTemplates.map((template) => (
                  <CommandItem
                    key={template.id}
                    value={`${template.name} ${template.message}`}
                    keywords={[template.category]}
                    onSelect={() => onSelect(template)}
                    className={cn('relative text-sm font-medium', isBrowsingCategories && 'hidden')}
                    onMouseOver={() => setPreview(template.message)}
                    onMouseLeave={() => setPreview('')}
                  >
                    <div>
                      <span className="block text-basic">{template.name}</span>
                      <span className="text-primary-700">{template.category}</span>
                    </div>
                  </CommandItem>
                ))}
                <CommandItem
                  value="create-new-template"
                  forceMount
                  className="text-sm font-semibold text-primary"
                  onSelect={() => setCreateOpen(true)}
                >
                  Create new template
                  <Plus weight="bold" className="!size-5 !bg-transparent !text-primary !opacity-100" />
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <TemplateDialog open={isCreateOpen} onOpenChange={setCreateOpen} />
    </>
  );
};

export default TemplatePicker;
