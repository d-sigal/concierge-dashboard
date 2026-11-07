'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChatCircleText, Lightning } from '@phosphor-icons/react';
import DialogIcon from '@/components/common/DialogIcon';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import { brand } from '@/config/brand';
import { env } from '@/config/env';
import { useQuotaAlerts } from '@/features/workspace/hooks';

type QuotaAlert = 'nearLimit' | 'exceeded';

const ALERTS: Record<
  QuotaAlert,
  { title: string; description: string; upsell: string; iconVariant: 'default' | 'destructive' }
> = {
  nearLimit: {
    title: `You're nearing your ${brand.name} plan limit`,
    description: `Don't worry, ${brand.assistantName} will keep running. Once you reach the limit, on-demand pricing applies.`,
    upsell: 'Upgrade now to save on messaging costs.',
    iconVariant: 'default',
  },
  exceeded: {
    title: `You've exceeded your ${brand.name} plan limit`,
    description: `${brand.assistantName} is still assisting customers. On-demand pricing now applies.`,
    upsell: 'Upgrade now to reduce messaging costs.',
    iconVariant: 'destructive',
  },
};

/** Plan usage warnings, shown once per session for each alert level. */
const GlobalAlerts = () => {
  const { limitExceeded, nearLimit } = useQuotaAlerts();
  const [dismissed, setDismissed] = useState<QuotaAlert[]>([]);

  const active: QuotaAlert | null = limitExceeded ? 'exceeded' : nearLimit ? 'nearLimit' : null;
  if (!active) return null;

  const alert = ALERTS[active];
  const dismiss = () => setDismissed((prev) => [...prev, active]);

  return (
    <Dialog open={!dismissed.includes(active)} onOpenChange={(open) => !open && dismiss()}>
      <DialogContent>
        <DialogTitle>
          <DialogIcon variant={alert.iconVariant}>
            <ChatCircleText weight="fill" size={20} />
          </DialogIcon>
          {alert.title}
        </DialogTitle>
        <DialogDescription>
          {alert.description}
          {env.billingUrl && (
            <>
              <br />
              <br />
              {alert.upsell}
            </>
          )}
        </DialogDescription>
        <DialogFooter>
          <Button
            asChild
            variant={env.billingUrl ? 'outline' : 'default'}
            className="mt-4 w-full font-semibold lg:mt-0"
          >
            <Link href="/settings/subscription" onClick={dismiss}>
              View current plan
            </Link>
          </Button>
          {env.billingUrl && (
            <Button asChild className="w-full gap-x-2 font-semibold" autoFocus>
              <a href={env.billingUrl} target="_blank" rel="noopener noreferrer" onClick={dismiss}>
                Upgrade <Lightning weight="fill" className="text-white" size={20} />
              </a>
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GlobalAlerts;
