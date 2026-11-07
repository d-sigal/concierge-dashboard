'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useApi } from '@/lib/api/ApiProvider';
import type { Clinic, ClinicSettings, ConnectWhatsAppInput, UpdateClinicInput } from '@/lib/api/types';
import { queryKeys } from '@/lib/query-keys';

/**
 * Workspace-level data used across features: the signed-in workspace, the
 * clinic profile, settings, billing quota and widget status.
 */

export const useWorkspace = () => {
  const api = useApi();
  return useQuery({ queryKey: queryKeys.workspace, queryFn: () => api.workspace.get() });
};

export const useClinic = () => {
  const api = useApi();
  return useQuery({ queryKey: queryKeys.clinic, queryFn: () => api.workspace.getClinic() });
};

export const useUpdateClinic = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateClinicInput) => api.workspace.updateClinic(input),
    onMutate: (input) => {
      queryClient.setQueryData<Clinic>(queryKeys.clinic, (prev) =>
        prev ? { ...prev, ...input, ...(input.url === null && { website_last_crawled_at: null }) } : prev,
      );
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: queryKeys.clinic }),
  });
};

export const useAcceptTerms = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => api.workspace.acceptTerms(),
    onSuccess: () => {
      queryClient.setQueryData<Clinic>(queryKeys.clinic, (prev) =>
        prev ? { ...prev, terms_accepted: true } : prev,
      );
    },
  });
};

export const useConnectWhatsApp = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ConnectWhatsAppInput) => api.workspace.connectWhatsApp(input),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.clinic });
      void queryClient.invalidateQueries({ queryKey: queryKeys.workspace });
    },
  });
};

export const useSettings = () => {
  const api = useApi();
  return useQuery({ queryKey: queryKeys.settings, queryFn: () => api.settings.get() });
};

export const useUpdateSettings = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (patch: Partial<ClinicSettings>) => api.settings.update(patch),
    onMutate: (patch) => {
      queryClient.setQueryData<ClinicSettings>(queryKeys.settings, (prev) =>
        prev ? { ...prev, ...patch } : prev,
      );
    },
    onSuccess: (settings) => queryClient.setQueryData(queryKeys.settings, settings),
    onError: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings }),
  });
};

export const useUploadLogo = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => api.settings.uploadLogo(file),
    onSuccess: ({ logo }) => {
      queryClient.setQueryData<ClinicSettings>(queryKeys.settings, (prev) =>
        prev ? { ...prev, logo } : prev,
      );
    },
  });
};

export const useIsOnboarded = () => {
  const { data: clinic, isLoading } = useClinic();
  return { isOnboarded: Boolean(clinic?.is_onboarded), isLoading };
};

export const useQuota = () => {
  const api = useApi();
  const { isOnboarded } = useIsOnboarded();

  return useQuery({
    queryKey: queryKeys.quota,
    queryFn: () => api.billing.getQuota(),
    refetchInterval: 100_000,
    enabled: isOnboarded,
  });
};

/** Plan usage warnings derived from the quota. */
export const useQuotaAlerts = () => {
  const { data } = useQuota();
  return {
    limitExceeded: Boolean(data?.exceeded),
    nearLimit: Boolean(data?.near_limit),
  };
};

export const useWidgetSnippet = () => {
  const api = useApi();
  return useQuery({ queryKey: queryKeys.widget.snippet, queryFn: () => api.widget.getSnippet() });
};

/** Polls while onboarding is incomplete so the UI notices when the widget goes live. */
export const useWidgetStatus = () => {
  const api = useApi();
  const { isOnboarded } = useIsOnboarded();

  return useQuery({
    queryKey: queryKeys.widget.status,
    queryFn: () => api.widget.getStatus(),
    refetchInterval: isOnboarded ? false : 10_000,
  });
};

export const useInstalledChannels = () => {
  const { data: clinic } = useClinic();
  const { data: widgetStatus } = useWidgetStatus();

  const isWhatsAppInstalled = Boolean(clinic?.waba_active);
  const isWidgetInstalled = Boolean(widgetStatus?.status);

  return {
    isWhatsAppInstalled,
    isWidgetInstalled,
    installedCount: Number(isWhatsAppInstalled) + Number(isWidgetInstalled),
  };
};
