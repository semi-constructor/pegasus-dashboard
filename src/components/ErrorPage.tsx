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
      <section className="relative flex min-h-[calc(100vh-5rem)] items-center justify-center overflow-hidden px-6 py-28 font-mono">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100%_4px]" />

        <div className="max-w-2xl text-center">
          <div className="mx-auto mb-7 flex size-16 items-center justify-center rounded-none border border-border bg-background text-foreground shadow-none font-mono">
            {isNotFound ? <SearchX className="size-8" aria-hidden="true" /> : <RotateCcw className="size-8" aria-hidden="true" />}
          </div>
          <p className="text-7xl font-mono font-bold tracking-[0.2em] text-foreground sm:text-9xl uppercase" aria-hidden="true">
            {isNotFound ? "404" : "500"}
          </p>
          <h1 className="mt-5 text-2xl sm:text-3xl font-mono font-bold uppercase tracking-widest text-foreground">{t(`${status}.title`)}</h1>
          <p className="mx-auto mt-4 max-w-xl text-xs sm:text-sm font-mono leading-relaxed text-muted-foreground">
            {t(`${status}.description`)}
          </p>
          <p className="mt-5 min-h-6 text-xs font-mono uppercase tracking-widest text-muted-foreground">
            {lines[lineIndex]}
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            {onRetry && (
              <Button onClick={onRetry} size="lg" className="h-11 px-6 rounded-none border border-border bg-foreground text-background hover:bg-zinc-200 font-mono text-xs font-bold uppercase tracking-wider">
                <RotateCcw className="size-4" aria-hidden="true" />
                {t("tryAgain")}
              </Button>
            )}
            <Button asChild size="lg" variant={onRetry ? "outline" : "default"} className="h-11 px-6 rounded-none border border-border bg-background text-foreground hover:bg-foreground hover:text-background font-mono text-xs uppercase tracking-wider transition-all">
              <Link href="/">
                <House className="size-4" aria-hidden="true" />
                {t("goHome")}
              </Link>
            </Button>
            <Button asChild size="lg" variant="ghost" className="h-11 px-6 rounded-none border border-transparent text-muted-foreground hover:text-foreground hover:bg-foreground/10 font-mono text-xs uppercase tracking-wider transition-all">
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
