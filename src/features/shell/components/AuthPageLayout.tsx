import type { ReactNode } from 'react';
import { ChatsCircle, Lightning, UserSwitch } from '@phosphor-icons/react/dist/ssr';
import { brand } from '@/config/brand';

const features = [
  { icon: ChatsCircle, text: 'WhatsApp and website chat in one inbox' },
  { icon: Lightning, text: 'Instant AI answers, around the clock' },
  { icon: UserSwitch, text: 'Take over any conversation with one click' },
];

/** Two-column sign-in/sign-up layout: the auth form on the left, a product showcase on large screens. */
const AuthPageLayout = ({ children }: { children: ReactNode }) => (
  <section className="size-full grid-cols-2 items-center bg-white lg:grid" id="sign-in">
    <div>{children}</div>
    <div className="relative hidden h-full items-center justify-center bg-gradient-to-br from-brand-900 to-brand-500 px-12 text-3xl text-white lg:flex">
      <div className="w-full">
        <h1 className="mb-14 font-secondary text-[28px] font-normal uppercase leading-relaxed">
          {brand.assistantName} gets you <br /> more leads and manages bookings.
        </h1>
        <ul className="space-y-6 text-lg font-medium">
          {features.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-x-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Icon size={24} weight="duotone" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </section>
);

export default AuthPageLayout;
