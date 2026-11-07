'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { MagnifyingGlass, X } from '@phosphor-icons/react';
import { Input } from '@/components/ui/input';
import { SEARCH_PARAM, useConversationSearch } from '@/features/chat/hooks';

const SEARCH_DEBOUNCE_MS = 300;

/** Search box that commits its value to the `?search=` URL param after a short pause in typing. */
const InboxSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const committedSearch = useConversationSearch() ?? '';
  const [value, setValue] = useState(committedSearch);

  useEffect(() => {
    if (value === committedSearch) return;

    const timeout = setTimeout(() => {
      router.replace(value ? `${pathname}?${SEARCH_PARAM}=${encodeURIComponent(value)}` : pathname);
    }, SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timeout);
  }, [value, committedSearch, pathname, router]);

  const clear = () => {
    setValue('');
    router.replace(pathname);
  };

  return (
    <div className="relative">
      <MagnifyingGlass
        size={20}
        className="absolute left-2 top-1/2 -translate-y-1/2 transform text-brand-400"
      />
      <Input
        onChange={(event) => setValue(event.target.value)}
        className="rounded-lg px-8"
        placeholder="Search by name, message, date"
        value={value}
      />
      {value.length > 0 && (
        <X
          className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 transform cursor-pointer text-icon"
          onClick={clear}
        />
      )}
    </div>
  );
};

export default InboxSearch;
