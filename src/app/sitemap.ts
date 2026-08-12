import { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';

import { db } from '@/lib/db';
import { guildSettings } from '../../schemas/guilds';
import { getPublishedBlogs } from '@/lib/blogs';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';

  // Current public static routes
  const staticRoutes = [
    '',
    '/blog',
    '/docs',
    '/docs/commands',
    '/docs/dashboard',
    '/docs/installation',
    '/changelog',
    '/terms-of-service',
    '/privacy',
    '/imprint',
    '/license',
    '/team',
    '/levels',
    '/eco',
    '/modules',
    '/module/automod',
    '/module/economy',
    '/module/engagement',
    '/module/giveaways',
    '/module/jtc',
    '/module/moderation',
    '/module/schedule',
    '/module/tickets',
    '/module/warns',
    '/module/xp',
    '/module/custom-commands',
    '/module/settings',
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

  const dynamicRoutes: string[] = [];

  // Fetch dynamic public guilds
  try {
    const publicGuilds = await db.select({
      guildId: guildSettings.guildId,
      publicLevels: guildSettings.publicLevels,
      publicEco: guildSettings.publicEco,
    }).from(guildSettings);

    for (const g of publicGuilds) {
      if (g.publicLevels) {
        dynamicRoutes.push(`/levels/${g.guildId}`);
      }
      if (g.publicEco) {
        dynamicRoutes.push(`/eco/${g.guildId}`);
      }
    }
  } catch (error) {
    console.error('Failed to fetch public guilds for sitemap:', error);
  }

  // Fetch dynamic published blogs
  try {
    const publishedBlogs = await getPublishedBlogs();
    for (const blog of publishedBlogs) {
      if (blog.slug) {
        dynamicRoutes.push(`/blog/${blog.slug}`);
      }
    }
  } catch (error) {
    console.error('Failed to fetch published blogs for sitemap:', error);
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
