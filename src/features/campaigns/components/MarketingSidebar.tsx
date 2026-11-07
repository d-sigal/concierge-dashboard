'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { PanelLeftClose, PanelRightClose } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn, readLocalStorage, writeLocalStorage } from '@/lib/utils';

const NAV_GROUP = {
  label: 'WhatsApp',
  links: [
    { label: 'Campaigns', href: '/marketing/campaigns' },
    { label: 'Templates', href: '/marketing' },
  ],
};

const STORAGE_KEY = 'marketingSidebarOpen';

const MarketingSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  // Read after mount so the server render and first client render match.
  useEffect(() => {
    if (readLocalStorage(STORAGE_KEY) === 'false') setIsOpen(false);
  }, []);

  const toggle = () => {
    setIsOpen(!isOpen);
    writeLocalStorage(STORAGE_KEY, String(!isOpen));
  };

  if (!isOpen) {
    return (
      <div className="mt-6">
        <Button variant="smallIcon" size="auto" onClick={toggle} aria-label="Show sidebar">
          <PanelRightClose className="hidden size-5 cursor-pointer md:block" />
        </Button>
      </div>
    );
  }

  return (
    <section className="-mx-4 w-auto shrink-0 flex-col gap-2 gap-y-0 rounded-none border border-[#EEF0EE] bg-white px-0 pb-0 pt-4 md:-mx-0 md:flex md:w-[200px] md:rounded-xl md:p-4 lg:w-[360px]">
      <h1 className="flex w-full items-center justify-between pb-5 pl-5 text-[22px] font-bold md:px-1 md:pl-0 lg:px-0 lg:pb-4 lg:text-2xl">
        Marketing
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="smallIcon" size="auto" onClick={toggle} aria-label="Hide sidebar">
              <PanelLeftClose className="hidden size-5 cursor-pointer md:block" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>Hide sidebar</TooltipContent>
        </Tooltip>
      </h1>
      <nav className="flex items-center overflow-x-auto md:block md:overflow-x-visible">
        <Accordion
          type="single"
          defaultValue={NAV_GROUP.label}
          collapsible
          className="hidden w-full md:block"
        >
          <AccordionItem value={NAV_GROUP.label} className="border-none">
            <AccordionTrigger className="pl-4">{NAV_GROUP.label}</AccordionTrigger>
            <AccordionContent className="p-0">
              {NAV_GROUP.links.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'mx-0 block rounded-lg py-2.5 pl-11 pr-4 text-sm font-semibold transition-colors hover:bg-primary-200',
                    pathname === href && 'bg-primary-400',
                  )}
                >
                  {label}
                </Link>
              ))}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Select value={pathname} onValueChange={(href) => router.push(href)}>
          <SelectTrigger className="w-fit shrink-0 justify-normal gap-x-2 rounded-none border-x-0 border-t-0 border-b-brand-500 py-0 text-sm text-basic md:hidden [&>svg]:ml-auto">
            {NAV_GROUP.label}
          </SelectTrigger>
          <SelectContent className="max-w-[168px]">
            {NAV_GROUP.links.map(({ label, href }) => (
              <SelectItem className="px-2 py-1 text-sm font-semibold [&>svg]:hidden" value={href} key={href}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </nav>
    </section>
  );
};

export default MarketingSidebar;
