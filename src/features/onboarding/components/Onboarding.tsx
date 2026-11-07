'use client';

import NoActivePlanDialog from '@/features/onboarding/components/NoActivePlanDialog';
import OnboardingFlow from '@/features/onboarding/components/OnboardingFlow';
import TermsDialog from '@/features/onboarding/components/TermsDialog';
import { useClinic, useWorkspace } from '@/features/workspace/hooks';

/**
 * Decides which blocking or guided UI the dashboard shows on top of the page:
 * terms acceptance first, then the no-plan notice, then the onboarding flow.
 */
const Onboarding = () => {
  const { data: clinic } = useClinic();
  const { data: workspace } = useWorkspace();

  if (!clinic || !workspace) return null;
  if (!clinic.terms_accepted) return <TermsDialog />;
  if (clinic.is_onboarded) return null;
  if (!workspace.active) return <NoActivePlanDialog />;
  return <OnboardingFlow />;
};

export default Onboarding;
