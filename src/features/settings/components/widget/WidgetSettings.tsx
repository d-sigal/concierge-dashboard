'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { brand } from '@/config/brand';
import { env } from '@/config/env';
import WidgetInstallationSteps from '@/features/onboarding/components/WidgetInstallationSteps';
import { useSettings } from '@/features/workspace/hooks';
import SettingsQueryFallback from '@/features/settings/components/SettingsQueryFallback';
import WidgetChannelsForm from '@/features/settings/components/widget/WidgetChannelsForm';

const WidgetInstallation = () => {
  const { onboardingCallUrl, widgetScriptUrl } = env;

  return (
    <>
      <h3 className="mb-6 text-lg font-semibold">How to add the {brand.name} widget to your website</h3>
      {onboardingCallUrl && (
        <>
          <h4 className="mb-4 text-gray-700">
            We recommend letting us handle the setup for you, but if you&apos;d like to do it yourself,
            it&apos;s easy and quick!
          </h4>
          <div className="mb-6 max-w-[480px]">
            <div className="mb-4">
              <strong>Option 1.</strong> <span className="pl-2 text-sm">Get us to install it for you</span>
              <Badge variant="recommended" className="ml-2">
                Recommended
              </Badge>
            </div>
            <h3 className="mb-4 font-medium">Schedule a 15 minute onboarding call</h3>
            <Button asChild className="w-full lg:w-auto">
              <a href={onboardingCallUrl} target="_blank" rel="noopener noreferrer">
                Schedule now
              </a>
            </Button>
          </div>
          <p className="mb-4 border-t border-gray-200 pt-6">
            <strong>Option 2.</strong> <span className="text-sm">Quick and easy self-install</span>
          </p>
        </>
      )}
      {!widgetScriptUrl && (
        <p className="mb-4 max-w-[480px] rounded-lg border border-yellow-400 bg-yellow-50 px-4 py-3 text-sm font-medium">
          The widget script URL is not configured, so the install snippet is incomplete. Set{' '}
          <code>NEXT_PUBLIC_WIDGET_SCRIPT_URL</code> to enable it.
        </p>
      )}
      <WidgetInstallationSteps />
    </>
  );
};

const WidgetSettings = () => {
  const { data: settings, ...query } = useSettings();

  if (!settings) return <SettingsQueryFallback queries={[query]} />;

  return (
    <WidgetChannelsForm settings={settings}>
      <WidgetInstallation />
    </WidgetChannelsForm>
  );
};

export default WidgetSettings;
