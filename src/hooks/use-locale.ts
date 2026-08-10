'use client';

import { useCallback } from 'react';
import { useLocale as useNextIntlLocale } from 'next-intl';
import { Locale } from '@/i18n/config';

export function useLocale(): Locale {
  return useNextIntlLocale() as Locale;
}

export function useSetLocale() {
  return useCallback((locale: Locale) => {
    document.cookie = `NEXT_LOCALE=${locale};path=/;max-age=${365 * 24 * 60 * 60};SameSite=Lax`;
    window.location.reload();
  }, []);
}
