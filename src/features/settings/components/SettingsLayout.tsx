import type { ReactNode } from 'react';
import { BigScreensContainer } from '@/components/ui/BigScreensContainer';
import SettingsSidebar, { type SettingsNavLink } from '@/features/settings/components/SettingsSidebar';

const NAV_LINKS: SettingsNavLink[] = [
  { label: 'Business', href: '/settings' },
  { label: 'Phone & WhatsApp', href: '/settings/whatsapp' },
  { label: 'Widget setup', href: '/settings/widget' },
  // The URL keeps its original spelling so existing links keep working.
  { label: 'Customization', href: '/settings/customisation' },
  { label: 'Subscription', href: '/settings/subscription' },
];

const SettingsLayout = ({ children }: { children: ReactNode }) => (
  <BigScreensContainer className="-mt-2.5 flex h-full flex-col px-4 md:mt-0 md:flex-row md:gap-x-5 md:pl-0 md:pr-6 lg:gap-x-6">
    <SettingsSidebar title="Settings" links={NAV_LINKS} />
    <div className="flex w-full flex-col overflow-auto pt-5 lg:pt-6">{children}</div>
  </BigScreensContainer>
);

export default SettingsLayout;
