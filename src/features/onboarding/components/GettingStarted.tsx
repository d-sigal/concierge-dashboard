import Link from 'next/link';
import Logo from '@/components/icons/Logo';
import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { isClerkEnabled } from '@/config/env';

const STEPS = [
  {
    title: 'Step 1: Log in to your account',
    body: `Log in to ${brand.name} with your work email address. If you don't have an account yet, you can create one on the same page.`,
  },
  {
    title: 'Step 2: Verify your account',
    body: 'Once you have entered your email, follow the steps to verify your account. More details are provided on the login page.',
  },
  {
    title: 'Step 3: Install the live chat widget',
    body: `Once logged in, you will arrive at a page with easy instructions on how to add the ${brand.name} live chat widget to your website.`,
  },
];

/** Public landing page explaining how to get started, linked from welcome emails. */
const GettingStarted = () => (
  <div className="h-full bg-gray-50 p-8">
    <Logo className="mx-auto size-24 text-primary" />
    <h1 className="mx-auto mb-6 max-w-xl text-center text-4xl font-bold">
      Welcome to {brand.name}! <br /> Let&apos;s get you set up with your 24/7 AI assistant.
    </h1>
    <p className="mx-auto mb-8 max-w-3xl text-lg">
      You&apos;re just moments away from transforming how your business connects with customers.{' '}
      {brand.assistantName} answers questions, schedules appointments, and communicates with your customers
      24/7 through live chat on your website and WhatsApp. Say goodbye to missed opportunities and hello to
      seamless customer experiences.
    </p>
    <div className="mx-auto max-w-lg">
      {STEPS.map(({ title, body }) => (
        <section key={title} className="mb-6">
          <h2 className="mb-0.5 text-lg font-semibold">{title}</h2>
          <p>{body}</p>
        </section>
      ))}
      {brand.supportEmail && (
        <p>
          For any assistance, our support team is available at{' '}
          <a href={`mailto:${brand.supportEmail}`} className="underline">
            {brand.supportEmail}
          </a>
          .
        </p>
      )}
      <div className="text-center">
        <Button asChild className="mt-8">
          <Link href={isClerkEnabled ? '/sign-in' : '/'}>Log in</Link>
        </Button>
      </div>
    </div>
  </div>
);

export default GettingStarted;
