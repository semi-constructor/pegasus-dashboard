"use client";

import { ErrorPage } from "@/components/ErrorPage";

export default function Error({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorPage status="unexpected" onRetry={reset} />;
}
