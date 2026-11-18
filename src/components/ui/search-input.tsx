'use client';

import { Search01Icon } from '@hugeicons/core-free-icons';
import { HugeIcon } from '@/components/ui/HugeIcon';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface SearchInputProps {
  placeholder?: string;
}

export function SearchInput({ placeholder }: SearchInputProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q')?.toString() || '');

  useEffect(() => {
    // Avoid a redundant navigation (and request) right after mount when the
    // term already matches the URL.
    const currentQuery = searchParams.get('q') ?? '';
    if (searchTerm === currentQuery) return;

    const handler = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (searchTerm) {
        params.set('q', searchTerm);
      } else {
        params.delete('q');
      }
      replace(`${pathname}?${params.toString()}`);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchTerm, pathname, replace, searchParams]);

  return (
    <div className="relative w-full sm:w-96">
      <HugeIcon icon={Search01Icon} size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        placeholder={placeholder || 'Buscar...'}
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring transition-all text-sm text-foreground placeholder:text-muted-foreground"
      />
    </div>
  );
}
