"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, House, RotateCcw, SearchX } from "lucide-react";
import { useTranslations } from "next-intl";

import { MarketingLayout } from "@/components/MarketingLayout";
import { Button } from "@/components/ui/button";

type ErrorPageProps = {
  status: "notFound" | "unexpected";
  onRetry?: () => void;
};

export function ErrorPage({ status, onRetry }: ErrorPageProps) {
  const t = useTranslations("errors");
  const isNotFound = status === "notFound";
  const lines = t.raw(`${status}.lines`) as string[];
  const [lineIndex, setLineIndex] = useState(0);

  useEffect(() => {
    setLineIndex(Math.floor(Math.random() * lines.length));
  }, [lines.length, status]);

  return (
    <MarketingLayout>
      <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-6 py-28">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_35%,oklch(0.55_0.2_285_/_0.18),transparent_42%)]" />
        <div className="absolute -left-24 top-1/4 -z-10 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -right-20 bottom-1/4 -z-10 size-64 rounded-full bg-primary/10 blur-3xl" />

        <div className="max-w-2xl text-center">
          <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10 text-primary shadow-lg shadow-primary/10">
            {isNotFound ? <SearchX className="size-8" aria-hidden="true" /> : <RotateCcw className="size-8" aria-hidden="true" />}
          </div>
          <p className="text-7xl font-black tracking-tighter text-foreground sm:text-9xl" aria-hidden="true">
            {isNotFound ? "404" : "500"}
          </p>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{t(`${status}.title`)}</h1>
          <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
            {t(`${status}.description`)}
          </p>
          <p className="mt-5 min-h-6 text-sm font-medium text-primary/90">
            {lines[lineIndex]}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            {onRetry && (
              <Button onClick={onRetry} size="lg" className="h-11 px-5">
                <RotateCcw className="size-4" aria-hidden="true" />
                {t("tryAgain")}
              </Button>
            )}
            <Button asChild size="lg" variant={onRetry ? "outline" : "default"} className="h-11 px-5">
              <Link href="/">
                <House className="size-4" aria-hidden="true" />
                {t("goHome")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-11 px-5">
              <Link href="/docs/commands">
                <ArrowLeft className="size-4" aria-hidden="true" />
                {t("viewDocs")}
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </MarketingLayout>
  );
}
