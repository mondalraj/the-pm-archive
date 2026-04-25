"use client";

import { useState, type FormEvent } from "react";
import { cn } from "@/lib/utils";

type Status = "idle" | "loading" | "success" | "error";

/**
 * Self-contained email signup form. Handles POST to the newsletter API,
 * its own loading / success / error state, and announces updates via
 * `aria-live`. Variant controls the visual style — `dark` sits on the
 * violet CTA band, `light` sits on page background.
 */
export function NewsletterForm({
  variant = "dark",
  className,
}: {
  variant?: "dark" | "light";
  className?: string;
}) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data: { ok?: boolean; error?: string } = await res
        .json()
        .catch(() => ({}));
      if (!res.ok || !data.ok) {
        throw new Error(data.error ?? "Something went wrong. Please try again.");
      }
      setStatus("success");
      setMessage("You're subscribed. Your next issue lands this week.");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Unable to subscribe.");
    }
  }

  const isDark = variant === "dark";

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-3 sm:flex-row", className)}
      noValidate
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        autoComplete="email"
        placeholder="your@email.com"
        className={cn(
          "h-12 flex-1 border px-5 text-base outline-none transition-colors focus:border-white",
          isDark
            ? "border-white/25 bg-white/10 text-white placeholder:text-white/50 focus:ring-2 focus:ring-white/40"
            : "border-border bg-surface text-foreground placeholder:text-muted-foreground focus:border-primary",
        )}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "label-caps inline-flex h-12 items-center justify-center px-8 transition-colors disabled:opacity-60",
          isDark
            ? "bg-white text-primary hover:bg-white/90"
            : "bg-primary text-primary-foreground hover:bg-primary/90",
        )}
      >
        {status === "loading" ? "Subscribing..." : "Subscribe for free"}
      </button>

      <p
        role="status"
        aria-live="polite"
        className={cn(
          "sm:ml-3 sm:self-center sm:text-sm",
          status === "idle" && "sr-only",
          isDark ? "text-white/80" : "text-foreground",
          status === "error" && (isDark ? "text-white" : "text-red-600"),
        )}
      >
        {message}
      </p>
    </form>
  );
}
