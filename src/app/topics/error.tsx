"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function TopicsError({
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
      heading="Couldn't load topics"
      description="We had trouble fetching topics and articles. This is usually a brief connection hiccup — hit 'Try again' to reload."
    />
  );
}
