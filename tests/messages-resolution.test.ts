import { describe, it, expect } from 'vitest';
import enMessages from '../src/i18n/messages/en';
import deMessages from '../src/i18n/messages/de';
import esMessages from '../src/i18n/messages/es';
import frMessages from '../src/i18n/messages/fr';

const allMessages = {
  en: enMessages,
  de: deMessages,
  es: esMessages,
  fr: frMessages,
};

describe('i18n Messages Bundle Resolution', () => {
  const locales = ['en', 'de', 'es', 'fr'] as const;

  for (const locale of locales) {
    it(`should contain footer.imprint for locale ${locale}`, () => {
      const messages = allMessages[locale];
      expect(messages).toBeDefined();
      expect(messages.footer).toBeDefined();
      expect(messages.footer.imprint).toBeDefined();
      expect(typeof messages.footer.imprint).toBe('string');
      expect(messages.footer.imprint.length).toBeGreaterThan(0);
    });

    it(`should contain all required namespaces for locale ${locale}`, () => {
      const messages = allMessages[locale];
      const requiredNamespaces = [
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
        'errors',
      ];

      for (const ns of requiredNamespaces) {
        expect(messages[ns as keyof typeof messages], `Namespace ${ns} in ${locale}`).toBeDefined();
      }
    });
  }
});
