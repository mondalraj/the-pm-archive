"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function ArticleError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      reset={reset}
      heading="Couldn't load this article"
      description="We had trouble fetching this article right now. Hit 'Try again' — it should load on the next attempt."
    />
  );
}
