'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button'; 

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsVisible(true); 
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
    window.dispatchEvent(new Event('cookieConsentUpdated'));
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'false');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="mx-auto max-w-4xl rounded-lg border border-border bg-background p-4 shadow-lg sm:flex sm:items-center sm:justify-between sm:p-6">
        <div className="mb-4 sm:mb-0 sm:pr-4">
          <h3 className="mb-1 text-lg font-semibold text-foreground">
            We value your privacy
          </h3>
          <p className="text-sm text-muted-foreground">
            We use cookies to analyze website traffic and improve your experience. 
            Since we are open-source, we let you decide.
          </p>
        </div>
        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
          <Button variant="outline" onClick={declineCookies}>
            Decline
          </Button>
          <Button onClick={acceptCookies}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}