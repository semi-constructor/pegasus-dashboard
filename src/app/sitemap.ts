import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

import { db } from '@/lib/db';
import { guildSettings } from '../../schemas/guilds';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';

  // Current public static routes
  const staticRoutes = [
    '',
    '/docs',
    '/changelog',
    '/terms-of-service',
    '/privacy',
    '/team',
    '/modules',
    '/alternatives/mee6',
    '/alternatives/dyno',
    '/alternatives/carl-bot',
    '/features/moderation',
    '/guides/discord-server-setup',
    '/resources/discord-rules-template',
    '/commands',
    '/discord-bot',
    '/discord-moderation-bot',
    '/discord-leveling-bot',
    '/open-source-discord-bot',
    '/discord-bot-commands',
    '/how-to-add-pegasus-bot'
  ];

  // Fetch dynamic public guilds
  const publicGuilds = await db.select({
    guildId: guildSettings.guildId,
    publicLevels: guildSettings.publicLevels,
    publicEco: guildSettings.publicEco,
  }).from(guildSettings);

  const dynamicRoutes: string[] = [];

  for (const g of publicGuilds) {
    if (g.publicLevels) {
      dynamicRoutes.push(`/levels/${g.guildId}`);
    }
    if (g.publicEco) {
      dynamicRoutes.push(`/eco/${g.guildId}`);
    }
  }

  const allRoutes = [...staticRoutes, ...dynamicRoutes];

  return allRoutes.map((route) => {
    const alternates = locales.reduce((acc, locale) => {
      // Default locale 'en' has no prefix, others have prefix
      const path = locale === 'en' ? route : `/${locale}${route}`;
      // Clean up double slashes
      acc[locale] = `${baseUrl}${path === '/' ? '' : path}`;
      return acc;
    }, {} as Record<string, string>);

    return {
      url: `${baseUrl}${route}`,
      lastModified: new Date(),
      changeFrequency: route === '' ? 'daily' : 'weekly',
      priority: route === '' ? 1 : 0.8,
      alternates: {
        languages: alternates,
      },
    };
  });
}
