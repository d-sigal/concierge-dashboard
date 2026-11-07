import type { Campaign, CampaignStatus } from '@/lib/api/types';

export const CAMPAIGN_STATUS_COLORS: Record<CampaignStatus, string> = {
  Sent: 'text-blue-700',
  Active: 'text-green-700',
  Paused: 'text-yellow-700',
  Cancelled: 'text-red-700',
  Pending: '',
  Inactive: '',
};

const percent = (value: number, total: number) => (total > 0 ? Math.round((value / total) * 100) : 0);

/** Delivery and engagement numbers for a campaign, as counts and rounded percentages of its recipients. */
export const getCampaignStats = (campaign: Campaign) => {
  const total = campaign.leads.length;
  const sent = campaign.statuses.filter(({ status }) => status === 'done').length;
  const failed = campaign.statuses.filter(({ status }) => status === 'failed').length;
  const read = campaign.read ?? 0;
  const replied = campaign.replied ?? 0;

  return {
    total,
    sent,
    failed,
    read,
    replied,
    sentPercent: percent(sent, total),
    readPercent: percent(read, total),
    repliedPercent: percent(replied, total),
  };
};

/** e.g. `Nov 07` */
export const formatLaunchDate = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
