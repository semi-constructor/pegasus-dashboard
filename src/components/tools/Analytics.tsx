'use client';

import { useEffect, useState } from 'react';
import { GoogleAnalytics, GoogleTagManager } from '@next/third-parties/google';

export default function Analytics() {
  const [hasConsent, setHasConsent] = useState(false);
  
  // Pull the IDs from your environment variables
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const gtmId = process.env.NEXT_PUBLIC_GTM_ID;

  useEffect(() => {
    // 1. Check existing consent on initial load
    if (localStorage.getItem('cookieConsent') === 'true') {
      setHasConsent(true);
    }

    // 2. Listen for the user clicking "Accept" in the banner
    const handleConsent = () => {
      if (localStorage.getItem('cookieConsent') === 'true') {
        setHasConsent(true);
      }
    };

    // This catches the event emitted by our CookieBanner
    window.addEventListener('cookieConsentUpdated', handleConsent);
    return () => window.removeEventListener('cookieConsentUpdated', handleConsent);
  }, []);

  // GDPR Compliance: If there is no consent, or if no IDs are set, render absolutely nothing.
  // The tracking scripts will NOT be injected into the page.
  if (!hasConsent || (!gaId && !gtmId)) return null;

  return (
    <>
      {gaId && <GoogleAnalytics gaId={gaId} />}
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
    </>
  );
}