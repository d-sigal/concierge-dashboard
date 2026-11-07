'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { RocketLaunch, Sparkle, WarningCircle, WhatsappLogo } from '@phosphor-icons/react';
import { brand } from '@/config/brand';
import ChecklistItem from '@/features/onboarding/components/progress/ChecklistItem';
import OnboardingCompleted from '@/features/onboarding/components/progress/OnboardingCompleted';
import OnboardingNoticeCard from '@/features/onboarding/components/progress/OnboardingNoticeCard';
import type { OnboardingNotice, OnboardingStep } from '@/features/onboarding/hooks';
import { useClinic, useInstalledChannels, useUpdateClinic } from '@/features/workspace/hooks';
import { toast } from '@/hooks/use-toast';
import { cn, readLocalStorage, writeLocalStorage } from '@/lib/utils';

const WIDGET_NOTICE_SHOWN_KEY = 'onboarding.widgetNoticeShown';
const TOTAL_STEPS = 3;

interface Props {
  notice: OnboardingNotice | null;
  setNotice: (notice: OnboardingNotice | null) => void;
  openStep: (step: OnboardingStep) => void;
}

/** Floating setup checklist shown while onboarding is incomplete and no dialog is open. */
const OnboardingProgress = ({ notice, setNotice, openStep }: Props) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const { mutate: updateClinic } = useUpdateClinic();
  const { data: clinic } = useClinic();
  const { installedCount, isWhatsAppInstalled, isWidgetInstalled } = useInstalledChannels();

  const isTrained = Boolean(clinic?.url || clinic?.website_last_crawled_at);
  const progress = [isWhatsAppInstalled, isWidgetInstalled, isTrained].filter(Boolean).length;
  const remaining = TOTAL_STEPS - progress;
  const percentage = `${Math.round((progress / TOTAL_STEPS) * 100)}%`;

  useEffect(() => {
    if (isWidgetInstalled && !readLocalStorage(WIDGET_NOTICE_SHOWN_KEY)) {
      setNotice('widgetActive');
      writeLocalStorage(WIDGET_NOTICE_SHOWN_KEY, 'true');
    }
  }, [isWidgetInstalled, setNotice]);

  if (remaining === 0) return <OnboardingCompleted />;

  const hideChecklist = () => {
    updateClinic({ is_onboarded: true });
    toast({
      className: 'max-w-fit ml-auto p-4',
      closeClassName: 'hidden',
      descriptionClassName: 'mb-0 font-semibold text-basic',
      duration: 3000,
      description: (
        <div>
          <RocketLaunch weight="fill" size={16} className="mr-3 inline-block" />
          Setup checklist skipped. You can complete the setup anytime from the settings menu.
        </div>
      ),
      action: (
        <Link
          href="/settings"
          className="border-l border-gray-100 p-0 pl-4 text-sm font-semibold text-brand-800"
        >
          Open settings
        </Link>
      ),
    });
  };

  return (
    <div className="fixed bottom-28 right-4 z-50 w-[344px]">
      {notice && <OnboardingNoticeCard notice={notice} onDismiss={() => setNotice(null)} />}
      <div
        className={cn(
          'rounded-xl border border-basic-blocks shadow-[0_4px_6px_-2px_rgba(14,25,39,0.05),0_6px_14px_-1px_rgba(14,25,39,0.2)] transition-all',
          isMinimized
            ? 'group cursor-pointer bg-brand-800 p-3 text-white hover:bg-brand-900'
            : 'bg-white px-5 py-6',
        )}
        onClick={isMinimized ? () => setIsMinimized(false) : undefined}
      >
        <div className="mb-2 flex items-center">
          <h3 className="flex items-center text-lg font-semibold">
            <RocketLaunch weight="fill" size={20} className="mr-3 inline-block" />
            Finalize setup
          </h3>
          {isMinimized ? (
            <ChevronUp
              size={20}
              className="ml-auto text-icon opacity-0 transition-opacity group-hover:opacity-100"
              aria-hidden
            />
          ) : (
            installedCount > 0 && (
              <button className="ml-auto text-sm font-semibold text-gray-500" onClick={hideChecklist}>
                Hide
              </button>
            )
          )}
        </div>

        {!isMinimized && (
          <>
            <p className="mb-5 text-sm font-medium text-gray-700">
              Complete your setup to unlock all {brand.name} features.
            </p>
            {installedCount > 0 && (
              <p className="mb-2 text-sm font-medium text-gray-700">{percentage} complete</p>
            )}
          </>
        )}
        {installedCount > 0 && (
          <ul className={cn('grid grid-cols-3 items-center gap-x-1', isMinimized ? 'mb-3' : 'mb-7')}>
            {Array.from({ length: TOTAL_STEPS }, (_, index) => (
              <li
                key={index}
                className={cn(
                  'h-1.5 rounded-full',
                  isMinimized
                    ? index < progress
                      ? 'bg-primary-400'
                      : 'bg-[#E8EDE8]/20'
                    : index < progress
                      ? 'bg-brand-800'
                      : 'bg-brand-800/20',
                )}
              />
            ))}
          </ul>
        )}
        {isMinimized ? (
          <p className="text-[10px] font-medium text-white">
            {percentage} completed. Only {remaining === 1 ? 'one small step' : `${remaining} small steps`}{' '}
            left!
          </p>
        ) : (
          <>
            <div className="space-y-3">
              {installedCount === 0 ? (
                <ChecklistItem
                  icon={<WarningCircle size={20} weight="fill" className="text-icon" />}
                  label={`Activate ${brand.assistantName}`}
                  tag="Required"
                  onClick={() => openStep('channels')}
                />
              ) : (
                <>
                  <ChecklistItem
                    done={isWidgetInstalled}
                    icon={<Image src="/widgetIcon.svg" width={20} height={20} alt="" />}
                    label={`${brand.name} widget not installed`}
                    doneLabel={`${brand.name} widget is installed`}
                    tag="Required"
                    onClick={() => openStep('liveChat')}
                  />
                  <ChecklistItem
                    done={isWhatsAppInstalled}
                    icon={<WhatsappLogo className="text-icon" weight="fill" size={20} />}
                    label="WhatsApp is not activated"
                    doneLabel="WhatsApp is activated"
                    tag="Optional"
                    onClick={() => openStep('whatsapp')}
                  />
                </>
              )}
              <ChecklistItem
                done={isTrained}
                icon={<Sparkle className="text-icon" weight="fill" size={20} />}
                label={`${brand.assistantName} is not trained`}
                doneLabel={`${brand.assistantName} is trained`}
                tag="Optional"
                onClick={() => openStep('train')}
              />
            </div>

            <button
              onClick={() => setIsMinimized(true)}
              className="mt-7 flex items-center gap-x-2 text-sm font-semibold text-brand-800"
            >
              <ChevronDown size={20} /> Minimize
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OnboardingProgress;
