import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css';
import { cn } from "@/lib/utils";
import { NextIntlClientProvider } from 'next-intl';
import { getLocale, getMessages } from 'next-intl/server';
import CookieBanner from '@/components/Cookie'; 
import Analytics from '@/components/tools/Analytics'; 
import { ThemeProvider } from '@/components/ThemeProvider'; 

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  
  const { getTranslations } = await import('next-intl/server');
  const t = await getTranslations({ locale, namespace: 'common' });
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://pegasusbot.app';

  return {
    title: {
      template: '%s | PegasusBot',
      default: t('metaTitle'),
    },
    description: t('metaDescription'),
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: {
        template: '%s | PegasusBot',
        default: t('metaTitle'),
      },
      description: t('metaDescription'),
      url: baseUrl,
      siteName: 'PegasusBot',
      locale: locale,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: t('metaTitle'),
      description: t('metaDescription'),
    },
    alternates: {
      canonical: baseUrl,
      languages: {
        'en-US': '/en',
        'de-DE': '/de',
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
    }
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale} className={cn("font-sans", geist.variable)} suppressHydrationWarning>
      <body className={geist.className}>
        
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <CookieBanner /> 
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>

        <Analytics />
      </body>
    </html>
  )
}