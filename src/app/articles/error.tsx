"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function ArticlesError({
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
      heading="Couldn't load the archive"
      description="We had trouble fetching the articles. This is usually a brief connection hiccup — hit 'Try again' and you'll be reading in seconds."
    />
  );
}
