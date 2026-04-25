"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

type ErrorDisplayProps = {
  error: Error & { digest?: string };
  reset: () => void;
  /** Heading shown above the message. Defaults to a generic fallback. */
  heading?: string;
  /** Subtext. Defaults to a generic fallback. */
  description?: string;
};

/**
 * Full-page error state rendered by Next.js `error.tsx` boundaries.
 *
 * Displays a tasteful editorial-style message and surfaces:
 * - A "Try again" button that calls `reset()` so Next.js re-renders the
 *   failing server component without a full page reload.
 * - A "Go home" escape hatch.
 * - In development only: the raw error message so engineers can act fast.
 */
export function ErrorDisplay({
  error,
  reset,
  heading = "Something went wrong",
  description = "We couldn't load this page right now. It's likely a brief network hiccup — give it another try.",
}: ErrorDisplayProps) {
  useEffect(() => {
    // Surface to any error-monitoring service (e.g. Sentry) if wired up.
    console.error(error);
  }, [error]);

  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      {/* Decorative glyph */}
      <div
        aria-hidden
        className="mb-8 flex h-16 w-16 items-center justify-center rounded-full border border-border bg-surface text-3xl shadow-sm"
      >
        ⚠
      </div>

      {/* Copy */}
      <h1 className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
        {heading}
      </h1>
      <p className="mt-4 max-w-md text-base leading-relaxed text-muted-foreground">
        {description}
      </p>

      {/* Dev-only details */}
      {process.env.NODE_ENV === "development" && (
        <p className="mt-4 max-w-lg rounded border border-border bg-surface px-4 py-3 font-mono text-xs text-muted-foreground">
          {error.message}
        </p>
      )}

      {/* Actions */}
      <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={reset} variant="primary" size="md">
          Try again
        </Button>
        <Button
          onClick={() => (window.location.href = "/")}
          variant="secondary"
          size="md"
        >
          Go home
        </Button>
      </div>
    </Container>
  );
}
