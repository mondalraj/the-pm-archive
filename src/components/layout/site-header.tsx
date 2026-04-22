"use client";

import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { ButtonLink } from "@/components/ui/button";

/**
 * Sticky editorial top-bar. Uses a client component only for the mobile
 * menu toggle; the link/nav data is imported straight from siteConfig so
 * the markup stays statically renderable.
 */
export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-50 border-b border-border">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-6 md:h-18 md:px-10">
        <Link
          href="/"
          className="group inline-flex items-center font-serif text-xl font-semibold tracking-tight md:text-2xl"
        >
          <span>{siteConfig.name.replace(/\.$/, "")}</span>
          <span className="text-primary transition-transform duration-300 group-hover:translate-x-0.5">.</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteConfig.nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="label-caps text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <ButtonLink
            href="/#newsletter"
            variant="primary"
            size="sm"
            className="hidden sm:inline-flex"
          >
            Subscribe
          </ButtonLink>
          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground md:hidden"
          >
            <MenuIcon open={open} />
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      <div
        className={cn(
          "grid overflow-hidden border-t border-border transition-all duration-300 md:hidden",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0">
          <nav className="flex flex-col gap-1 px-6 py-4">
            {siteConfig.nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="label-caps py-3 text-muted-foreground hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <ButtonLink
              href="/#newsletter"
              onClick={() => setOpen(false)}
              variant="primary"
              size="md"
              className="mt-3 w-full"
            >
              Subscribe
            </ButtonLink>
          </nav>
        </div>
      </div>
    </header>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      aria-hidden
    >
      {open ? (
        <>
          <path d="M6 6l12 12" />
          <path d="M18 6L6 18" />
        </>
      ) : (
        <>
          <path d="M4 7h16" />
          <path d="M4 17h16" />
        </>
      )}
    </svg>
  );
}
