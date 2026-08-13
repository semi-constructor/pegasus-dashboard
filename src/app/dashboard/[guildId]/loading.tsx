'use client';

import { Loader2 } from "lucide-react";
import { useTranslations } from 'next-intl';

export default function DashboardLoading() {
  const t = useTranslations('dashboard');

  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
      <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/60">
        {t('loadingData')}
      </h2>
      <p className="text-foreground/40 mt-2 text-sm">
        {t('fetchingInfo')}
      </p>
    </div>
  );
}
