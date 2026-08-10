'use client';

import { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config';
import { useLocale, useSetLocale } from '@/hooks/use-locale';

export function LanguageSwitcher({ variant = 'default' }: { variant?: 'default' | 'compact' | 'footer' }) {
  const currentLocale = useLocale();
  const setLocale = useSetLocale();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (locale: Locale) => {
    if (locale !== currentLocale) {
      setLocale(locale);
    }
    setIsOpen(false);
  };

  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 w-full rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
          aria-label="Change language"
        >
          <Globe size={16} />
          <span className="text-xs">{localeFlags[currentLocale]} {localeNames[currentLocale]}</span>
          <ChevronDown size={14} className={`ml-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute left-0 bottom-full mb-1 w-full bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleSelect(locale)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  locale === currentLocale
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-secondary/50'
                }`}
              >
                <span className="text-base">{localeFlags[locale]}</span>
                <span className="flex-1 text-left">{localeNames[locale]}</span>
                {locale === currentLocale && <Check size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  if (variant === 'footer') {
    return (
      <div ref={dropdownRef} className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground border border-border/50 hover:border-border transition-all"
          aria-label="Change language"
        >
          <Globe size={14} />
          <span>{localeFlags[currentLocale]} {localeNames[currentLocale]}</span>
          <ChevronDown size={12} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        {isOpen && (
          <div className="absolute left-0 bottom-full mb-1 w-44 bg-card border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleSelect(locale)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  locale === currentLocale
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-secondary/50'
                }`}
              >
                <span className="text-base">{localeFlags[locale]}</span>
                <span className="flex-1 text-left">{localeNames[locale]}</span>
                {locale === currentLocale && <Check size={14} className="text-primary" />}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-all"
        aria-label="Change language"
      >
        <Globe size={16} />
        <span>{localeFlags[currentLocale]} {localeNames[currentLocale]}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-52 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 backdrop-blur-xl">
          <div className="p-1">
            {locales.map((locale) => (
              <button
                key={locale}
                onClick={() => handleSelect(locale)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                  locale === currentLocale
                    ? 'bg-primary/10 text-primary font-medium'
                    : 'text-foreground hover:bg-secondary/50'
                }`}
              >
                <span className="text-lg">{localeFlags[locale]}</span>
                <span className="flex-1 text-left">{localeNames[locale]}</span>
                {locale === currentLocale && <Check size={16} className="text-primary" />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
