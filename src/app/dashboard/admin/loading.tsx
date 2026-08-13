"use client";

import { Loader2 } from "lucide-react";

import { useTranslations } from "next-intl";

export default function AdminLoading() {
  const t = useTranslations('adminPages');

  return (
    <div className="w-full h-[60vh] flex flex-col items-center justify-center animate-in fade-in duration-500">
      <Loader2 className="w-12 h-12 text-purple-500 animate-spin mb-4" />
      <h2 className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-indigo-400">
        {t('loading.title')}
      </h2>
      <p className="text-foreground/40 mt-2 text-sm">
        {t('loading.description')}
      </p>
    </div>
  );
}
