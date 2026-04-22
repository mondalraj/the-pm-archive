import { Inter, Newsreader } from "next/font/google";

/**
 * Project-wide fonts. Only these two are used anywhere in the app.
 *
 * - `Newsreader`: serif — headings, pull quotes, editorial display copy
 *   (including italics for the hero).
 * - `Inter`:      sans  — body, UI, labels, buttons, captions.
 *
 * Both are loaded as variable fonts, self-hosted automatically by Next.js,
 * and exposed as CSS custom properties (`--font-sans`, `--font-serif`) so
 * Tailwind's `font-sans` / `font-serif` utilities resolve to them via
 * `@theme` in `globals.css`.
 */
export const fontSans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
  axes: ["opsz"],
});

export const fontSerif = Newsreader({
  variable: "--font-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  axes: ["opsz"],
});
