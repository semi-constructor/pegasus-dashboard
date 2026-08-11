import { getRequestConfig } from 'next-intl/server';
import { cookies, headers } from 'next/headers';
import { Locale, defaultLocale, locales } from './config';
import enMessages from './messages/en';
import deMessages from './messages/de';
import esMessages from './messages/es';
import frMessages from './messages/fr';

const messagesByLocale: Record<Locale, typeof enMessages> = {
  en: enMessages,
  de: deMessages,
  es: esMessages,
  fr: frMessages,
};

export default getRequestConfig(async () => {
  // Read locale from header set by middleware, fallback to cookie
  const headersList = await headers();
  const headerLocale = headersList.get('x-next-locale') as Locale | undefined;

  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined;

  const localeCandidate = headerLocale || cookieLocale;
  const locale: Locale =
    localeCandidate && locales.includes(localeCandidate) ? localeCandidate : defaultLocale;

  const messages = messagesByLocale[locale] ?? messagesByLocale[defaultLocale];

  return {
    locale,
    messages,
  };
});
