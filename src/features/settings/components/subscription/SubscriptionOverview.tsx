'use client';

import { Question } from '@phosphor-icons/react';
import PageSpinner from '@/components/common/PageSpinner';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { env } from '@/config/env';
import { useQuota } from '@/features/workspace/hooks';
import type { Quota, Subscription } from '@/lib/api/types';
import { cn } from '@/lib/utils';

const formatMoney = (amount: number, currency: string) => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency.toUpperCase() }).format(
      amount,
    );
  } catch {
    // Unknown ISO code from the backend; show the raw amount rather than crash.
    return `${amount.toFixed(2)} ${currency.toUpperCase()}`;
  }
};

const formatDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? null
    : date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
};

const BillingActions = () => {
  if (!env.billingUrl) return null;

  return (
    <div className="mt-6 flex flex-wrap-reverse items-center justify-between gap-y-4 lg:mt-12">
      <Button asChild variant="text" size="auto" className="w-full md:w-auto">
        <a href={env.billingUrl} target="_blank" rel="noopener noreferrer">
          Manage subscription
        </a>
      </Button>
      <Button asChild className="w-full md:w-auto">
        <a href={env.billingUrl} target="_blank" rel="noopener noreferrer">
          Upgrade
        </a>
      </Button>
    </div>
  );
};

const NoActivePlan = ({ message }: { message: string }) => (
  <div className="rounded-xl border border-strokes-blocks bg-white p-5 lg:p-6">
    <h2 className="mb-2 text-lg font-semibold text-basic">No active plan</h2>
    <p className="max-w-lg text-sm text-gray-700">{message}</p>
    <BillingActions />
  </div>
);

const ActivePlan = ({ quota, subscription }: { quota: Quota; subscription: Subscription }) => {
  const { total, consumed, on_demand_value } = quota;
  const { name, description, next_billing_date, price, on_demand_price, currency, interval } = subscription;

  const usage = total > 0 ? Math.round((consumed / total) * 100) : 0;
  const onDemandMessages = Math.max(consumed - total, 0);
  const onDemandCost = onDemandMessages * on_demand_value;
  const nextPayment = formatDate(next_billing_date);

  return (
    <div className="rounded-xl border border-strokes-blocks bg-white p-5 lg:p-6">
      <div className="flex flex-wrap items-start justify-between gap-x-4 lg:flex-nowrap">
        <div className="w-full lg:w-auto">
          <h2 className="mb-3 flex items-center justify-between text-lg font-semibold text-basic lg:mb-2">
            {name}
          </h2>
          <p className="mb-4 max-w-lg text-sm text-gray-700 lg:font-medium">{description}</p>
          <p className="mb-6 text-sm font-medium text-basic lg:mb-7">
            <strong className="text-2xl">{formatMoney(price, currency)}</strong>
            <span className="pl-1 text-sm text-gray-700">/ {interval}</span>
          </p>
          <div className="mb-6 grid-cols-2 gap-x-6 md:grid lg:mb-0 lg:block">
            <div>
              <strong className="mb-2 block lg:mb-4">Messages sent</strong>
              <div className="flex items-center gap-x-3">
                <Progress value={Math.min(usage, 100)} className="lg:max-w-[200px]" />
                <p className="whitespace-nowrap font-medium">
                  {consumed} / {total}
                </p>
              </div>
              <span className={cn(usage > 100 ? 'text-red' : 'text-yellow-dark')}>{usage}% utilized</span>
            </div>
            <div className="mt-6 md:mt-0 lg:mt-6">
              <strong className="mb-2 flex items-center gap-x-1 font-bold">
                Pay per on-demand message
                <Tooltip>
                  <TooltipTrigger type="button" aria-label="About on-demand messages">
                    <Question size={20} />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Pay per message sent beyond your plan&apos;s limit</p>
                  </TooltipContent>
                </Tooltip>
              </strong>
              <p className="mb-8 font-medium">{on_demand_price}</p>
            </div>
          </div>
        </div>

        <div className="mb-2 w-full lg:max-w-[360px]">
          <div className="rounded-lg border border-gray-100">
            <div className="flex items-center justify-between bg-brand-50 p-5">
              <div>
                <h3 className="mb-2 font-bold">Estimated total</h3>
                {nextPayment && <p className="text-sm">Next payment on {nextPayment}</p>}
              </div>
              <strong className="text-3xl">{formatMoney(price + onDemandCost, currency)}</strong>
            </div>
            <div className="space-y-5 px-5 py-5 md:py-8">
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="mb-1 font-bold text-basic">{name}</p>
                  <p className="font-medium">{total} messages</p>
                </div>
                <strong>{formatMoney(price, currency)}</strong>
              </div>
              <div className="flex items-center justify-between text-sm">
                <div>
                  <p className="mb-1 font-bold text-basic">On-demand messages</p>
                  <p className="font-medium">{onDemandMessages} used</p>
                </div>
                <strong>{formatMoney(onDemandCost, currency)}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BillingActions />
    </div>
  );
};

const SubscriptionOverview = () => {
  const { data: quota, isLoading, isError } = useQuota();

  return (
    <div>
      <h3 className="mb-5 text-lg font-semibold">Active plan</h3>
      {isLoading ? (
        <PageSpinner />
      ) : quota?.subscription ? (
        <ActivePlan quota={quota} subscription={quota.subscription} />
      ) : (
        <NoActivePlan
          message={
            isError
              ? "We couldn't load your plan details. Please try again later."
              : "You don't have an active plan yet. Once you subscribe, your plan and usage will appear here."
          }
        />
      )}
    </div>
  );
};

export default SubscriptionOverview;
