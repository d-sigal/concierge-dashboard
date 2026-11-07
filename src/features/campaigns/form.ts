export const MAX_CAMPAIGN_CONTACTS = 10;

export interface CampaignFormValues {
  name: string;
  templateSource: 'existing' | 'new';
  templateId: string;
  lead_ids: string[];
  start: 'now' | 'scheduled';
  date: Date | undefined;
  /** `HH:mm` */
  time: string;
  accept_terms: boolean;
}

/** Fields that can be prefilled, e.g. when duplicating an existing campaign. */
export type CampaignPrefill = Pick<CampaignFormValues, 'name' | 'templateId' | 'lead_ids'>;

export const getCampaignFormDefaults = (prefill?: CampaignPrefill): CampaignFormValues => ({
  name: '',
  templateSource: 'existing',
  templateId: '',
  lead_ids: [],
  start: 'now',
  date: undefined,
  time: '',
  accept_terms: false,
  ...prefill,
});
