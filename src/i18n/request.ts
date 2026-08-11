import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';
import { Locale, defaultLocale, locales } from './config';
import enSeoMessages from './messages/en/seo.json';
import deSeoMessages from './messages/de/seo.json';
import esSeoMessages from './messages/es/seo.json';
import frSeoMessages from './messages/fr/seo.json';

const seoMessages: Record<Locale, typeof enSeoMessages> = {
  en: enSeoMessages,
  de: deSeoMessages,
  es: esSeoMessages,
  fr: frSeoMessages,
};

async function loadMessages(locale: Locale) {
  const namespaces = [
    'common',
    'landing',
    'features',
    'footer',
    'navbar',
    'dashboard',
    'login',
    'changelog',
    'legal',
    'docs',
    'guild',
    'admin',
    'profile',
    'guildSettings',
    'guildTickets',
    'guildEconomy',
    'guildXp',
    'guildEngagement',
    'guildGiveaways',
    'guildJtc',
    'guildCustomCommands',
    'guildWarns',
    'guildAutomod',
    'guildModeration',
    'guildSchedule',
    'adminPages',
    'profilePages',
    'forms',
    'modules',
    'team',
    'seo',
    'errors'
  ] as const;

  const messages: Record<string, any> = {};

  for (const ns of namespaces) {
    if (ns === 'seo') {
      messages[ns] = seoMessages[locale];
      continue;
    }

    try {
      const mod = await import(`./messages/${locale}/${ns}.json`);
      messages[ns] = mod.default;
    } catch {
      // Fallback to English if translation file is missing
      try {
        const fallback = await import(`./messages/en/${ns}.json`);
        messages[ns] = fallback.default;
      } catch {
        messages[ns] = {};
      }
    }
  }

  return messages;
}

export default getRequestConfig(async () => {
  // Read locale from header set by middleware, fallback to cookie
  const headersList = await import('next/headers').then(m => m.headers());
  const headerLocale = headersList.get('x-next-locale') as Locale | undefined;

  const cookieStore = await import('next/headers').then(m => m.cookies());
  const cookieLocale = cookieStore.get('NEXT_LOCALE')?.value as Locale | undefined;

  const localeCandidate = headerLocale || cookieLocale;
  const locale: Locale =
    localeCandidate && locales.includes(localeCandidate) ? localeCandidate : defaultLocale;

  const messages = await loadMessages(locale);

  return {
    locale,
    messages,
  };
});
