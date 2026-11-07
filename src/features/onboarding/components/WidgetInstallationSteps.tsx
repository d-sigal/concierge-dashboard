'use client';

import type { ReactNode } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CheckIcon } from 'lucide-react';
import { Copy } from '@phosphor-icons/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { useCopyToClipboard } from '@/features/onboarding/hooks';
import { buildWidgetInitCode, widgetScriptTag } from '@/features/onboarding/widget-code';
import { useWidgetSnippet } from '@/features/workspace/hooks';
import { useSession } from '@/lib/auth/session';

interface Props {
  isOnboardingActive?: boolean;
  onClickSelfInstall?: () => void;
}

type SnippetKey = 'script' | 'init';

const buildEmailBody = (scriptTag: string, initCode: string, senderName: string | undefined) =>
  [
    'Hi,',
    '',
    `Could you please add the ${brand.name} live chat widget to our website? It lets visitors chat with us and book appointments right from the site. Here are the steps:`,
    '',
    "1. Open the website's admin panel or content management system (CMS), like WordPress, Wix, or Shopify.",
    '',
    "2. Find the section where the website's HTML can be edited.",
    '',
    '3. Insert the following code inside the <head> section of the HTML (usually near the top of the page):',
    scriptTag,
    '',
    '4. Insert this code just before the closing </body> tag (near the bottom of the page):',
    initCode,
    '5. Save and publish the changes.',
    '',
    '6. Refresh the website. The chat widget should now be live.',
    '',
    ...(brand.supportEmail
      ? [`If you have any questions, ${brand.name} support can help at ${brand.supportEmail}.`, '']
      : []),
    'Thank you!',
    ...(senderName ? [senderName] : []),
  ].join('\n');

const CodeSnippet = ({ code, copied, onCopy }: { code: string; copied: boolean; onCopy: () => void }) => (
  <div className="relative mt-3 flex items-center gap-x-2">
    <SyntaxHighlighter
      language="javascript"
      style={oneLight}
      customStyle={{ borderRadius: '8px', paddingRight: '40px', width: '100%', maxWidth: '100%' }}
      codeTagProps={{ style: { whiteSpace: 'pre-wrap', wordBreak: 'break-word' } }}
    >
      {code}
    </SyntaxHighlighter>
    <button
      type="button"
      aria-label="Copy code"
      className="absolute right-2 top-4 z-10 rounded-md bg-slate-800 p-2 text-white hover:bg-zinc-700"
      onClick={onCopy}
    >
      {copied ? <CheckIcon className="size-3" /> : <Copy className="size-3" />}
    </button>
  </div>
);

const InstallationStep = ({
  number,
  title,
  isLast,
  children,
}: {
  number: number;
  title: string;
  isLast?: boolean;
  children: ReactNode;
}) => (
  <div
    className={
      isLast
        ? 'relative pl-8'
        : 'relative pl-8 before:absolute before:bottom-2 before:left-4 before:h-[calc(100%-45px)] before:w-0.5 before:bg-basic-divider'
    }
  >
    <div className="relative pb-7 pl-3">
      <h3 className="mb-3 font-bold tracking-tight">
        <span className="absolute left-[-28px] top-0 grid size-6 place-items-center rounded-full bg-basic text-sm font-normal text-white">
          {number}
        </span>
        {title}
      </h3>
      {children}
    </div>
  </div>
);

const WidgetInstallationSteps = ({ isOnboardingActive, onClickSelfInstall }: Props) => {
  const { data: snippet } = useWidgetSnippet();
  const { user } = useSession();
  const { copiedKey, copy } = useCopyToClipboard<SnippetKey>();

  const initCode = buildWidgetInitCode(snippet);
  const emailSubject = `${brand.name} widget installation instructions`;
  const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(
    buildEmailBody(widgetScriptTag, initCode, user?.name),
  )}`;

  return (
    <Accordion type="single" collapsible className="w-full rounded-xl">
      <AccordionItem value="steps" className="border-none py-0">
        <AccordionTrigger className="py-0 text-left text-sm">
          Prefer to do it yourself? No problem! Just follow these six simple steps
        </AccordionTrigger>
        <AccordionContent className="mt-4 border-t border-gray-100 pb-0 pt-6 text-base">
          <InstallationStep number={1} title="Open your website's admin panel or CMS">
            <p>
              Access your website&apos;s admin panel or content management system (CMS), like WordPress, Wix,
              or Shopify.
            </p>
          </InstallationStep>
          <InstallationStep number={2} title="Find the HTML section">
            <p>Find the section where you can edit your website&apos;s HTML.</p>
            <p className="mt-3 text-gray-700">
              <strong className="font-semibold">Tip:</strong> If you&apos;re unsure where to find this, check
              your theme settings or ask your website manager for help.
            </p>
          </InstallationStep>
          <InstallationStep number={3} title="Add the first widget code">
            <p>
              Insert the first code snippet inside the{' '}
              <code className="font-bold text-green-600">&lt;head&gt;</code> section of your HTML (usually
              near the top of the page).
            </p>
            <CodeSnippet
              code={widgetScriptTag}
              copied={copiedKey === 'script'}
              onCopy={() => copy('script', widgetScriptTag)}
            />
          </InstallationStep>
          <InstallationStep number={4} title="Add the second widget code">
            <p>
              Insert the second code snippet just before the closing{' '}
              <code className="font-bold text-green-600">&lt;/body&gt;</code> tag (near the bottom of the
              page).
            </p>
            <CodeSnippet
              code={initCode}
              copied={copiedKey === 'init'}
              onCopy={() => copy('init', initCode)}
            />
          </InstallationStep>
          <InstallationStep number={5} title="Save and publish changes">
            <p>Save the changes you&apos;ve made.</p>
          </InstallationStep>
          <InstallationStep number={6} title="Refresh your website" isLast>
            <p>
              Refresh your website and <span className="font-semibold">voilà!</span> The {brand.name} chat
              widget should now be live on your site, ready to impress your visitors.
            </p>
          </InstallationStep>
          <div className="pl-8">
            {isOnboardingActive ? (
              <div className="items-center justify-between space-y-2 lg:flex lg:space-y-0">
                <Button asChild variant="outline" className="w-full lg:w-auto">
                  <a href={mailtoLink}>Email instructions</a>
                </Button>
                <Button className="w-full lg:w-auto" onClick={onClickSelfInstall}>
                  Done
                </Button>
              </div>
            ) : (
              <Button asChild variant="secondary">
                <a href={mailtoLink}>Email instructions</a>
              </Button>
            )}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default WidgetInstallationSteps;
