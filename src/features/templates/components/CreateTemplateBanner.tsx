import StartingBanner from '@/features/campaigns/components/StartingBanner';

const CreateTemplateBanner = ({ onClick }: { onClick: () => void }) => (
  <StartingBanner
    type="template"
    onClick={onClick}
    ctaLabel="Create template"
    className="-mb-6 mt-auto"
    title="Start your marketing campaign with a template"
    description={
      <>
        Templates are pre-approved messages required for marketing on WhatsApp. <br /> Create yours to connect
        with customers effectively and meet Meta&rsquo;s guidelines.
      </>
    }
  />
);

export default CreateTemplateBanner;
