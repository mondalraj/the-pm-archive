import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Conditionally join Tailwind class names while resolving conflicts
 * (later class wins). Standard helper used across components.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format an ISO date as "Mar 18, 2026" (long) or "Mar 18" (short).
 * SSR-safe: uses a fixed en-US locale and UTC so server and client agree.
 */
export function formatDate(iso: string, variant: "long" | "short" = "long") {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    ...(variant === "long" ? { year: "numeric" } : {}),
    timeZone: "UTC",
  });
}
