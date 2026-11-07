'use client';

import { useCallback, useMemo, useSyncExternalStore } from 'react';
import type { ColumnDef } from '@tanstack/react-table';

const MOBILE_QUERY = 'only screen and (max-width: 767px)';
const TABLET_QUERY = 'only screen and (min-width: 768px) and (max-width: 1140px)';

/** SSR-safe media query: renders as "no match" on the server and during hydration. */
const useMediaQuery = (query: string) => {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mediaQueryList = window.matchMedia(query);
      mediaQueryList.addEventListener('change', onChange);
      return () => mediaQueryList.removeEventListener('change', onChange);
    },
    [query],
  );

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
};

const getColumnId = <TData>(column: ColumnDef<TData, unknown>) =>
  column.id ?? ('accessorKey' in column ? String(column.accessorKey) : undefined);

interface Breakpoints {
  /** Column ids to keep below 768px. */
  mobile?: string[];
  /** Column ids to keep between 768px and 1140px. */
  tablet?: string[];
}

/** Drops columns that don't fit on small screens; the rest is shown in the expandable row. */
export const useResponsiveColumns = <TData>(
  columns: ColumnDef<TData, unknown>[],
  { mobile, tablet }: Breakpoints,
) => {
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const isTablet = useMediaQuery(TABLET_QUERY);

  const visibleIds = (isMobile && mobile) || (isTablet && tablet) || null;

  return useMemo(
    () => (visibleIds ? columns.filter((column) => visibleIds.includes(getColumnId(column) ?? '')) : columns),
    [columns, visibleIds],
  );
};
