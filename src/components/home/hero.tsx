"use client";

import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/motion/reveal";
import { InteractiveGrid } from "@/components/motion/interactive-grid";
import { SplitHeadline } from "@/components/motion/split-headline";
import { MagneticLink } from "@/components/motion/magnetic-link";

/**
 * Editorial hero. A subtle interactive grid sits behind a centered
 * composition: small eyebrow tag, a large Newsreader italic headline
 * that reveals character-by-character, a supporting paragraph, two CTAs
 * (the primary is magnetic — it gently follows the cursor within a
 * radius), and three stats below a hairline rule.
 *
 * The grid is quiet by default; moving the cursor over the hero reveals
 * a soft violet spotlight that lights up the cells under it. Fully
 * honours `prefers-reduced-motion`.
 */
export function Hero() {
  return (
    <section className="relative isolate overflow-hidden border-b border-border bg-background">
      {/* Interactive grid backdrop (client-only). Sits above the page's
       * ambient backdrop (which would otherwise show through as a second,
       * drifting grid) because the section owns an opaque bg. */}
      <InteractiveGrid className="pointer-events-none absolute inset-0 z-0" />

      {/* Soft violet glow pinned behind the headline. */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[120%] w-[140%] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(closest-side, var(--glow), transparent 70%)",
        }}
      />

      <Container className="relative py-20 text-center md:py-32">
        <Reveal immediate delay={0}>
          <p className="label-caps mb-6 text-primary">
            The P.M. Archive - Built for operators
          </p>
        </Reveal>

        <h1 className="mx-auto max-w-4xl font-serif text-[clamp(2.5rem,6vw,5rem)] font-medium leading-[1.05] tracking-tight">
          <span className="block text-foreground display-glow">
            <SplitHeadline
              text="Ideas worth reading."
              italic
              delay={0.15}
            />
          </span>
          <span className="block text-muted-foreground">
            <SplitHeadline text="Applied in 5 minutes." delay={0.55} />
          </span>
        </h1>

        <Reveal immediate delay={1.05}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl">
            {siteConfig.description}
          </p>
        </Reveal>

        <Reveal immediate delay={1.2}>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <MagneticLink
              href="#newsletter"
              className="inline-flex h-12 items-center justify-center bg-primary px-7 font-sans text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground transition-colors duration-300 hover:bg-primary/90"
            >
              Subscribe for Free
            </MagneticLink>
            <ButtonLink href="/articles" variant="secondary" size="lg">
              Read 5-Minute Articles
            </ButtonLink>
          </div>
          <p className="mt-4 label-caps text-muted-foreground">
            1 practical issue every week for engineers, PMs, and founders
          </p>
        </Reveal>

        <Reveal immediate delay={1.35}>
          <dl className="mx-auto mt-16 grid max-w-xl grid-cols-3 gap-6 border-t border-border pt-10">
            <Stat value="5 min" label="Read time" />
            <Stat value="1x" label="Per week" />
            <Stat value="Zero fluff" label="Just signal" />
          </dl>
        </Reveal>
      </Container>

      {/* Bottom anchor target */}
      <Link
        href="#latest"
        aria-label="Jump to latest articles"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 text-muted-foreground transition-colors hover:text-primary"
      >
        <svg
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M12 5v14" />
          <path d="M6 13l6 6 6-6" />
        </svg>
      </Link>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col items-center gap-1">
      <dt className="font-serif text-2xl font-medium text-foreground md:text-3xl">
        {value}
      </dt>
      <dd className="label-caps text-muted-foreground">{label}</dd>
    </div>
  );
}
