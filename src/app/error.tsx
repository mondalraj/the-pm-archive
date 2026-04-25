"use client";

import { ErrorDisplay } from "@/components/ui/error-display";

export default function GlobalError({
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
      heading="Something went wrong"
      description="An unexpected error occurred. It's likely a brief hiccup — hit 'Try again' and it should resolve itself."
    />
  );
}
