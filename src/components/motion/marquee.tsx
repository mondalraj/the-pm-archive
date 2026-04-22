"use client";

/**
 * Marquee — a slow, infinite horizontal scroll.
 *
 * Renders the supplied items twice and translates the track -50% over
 * `duration` seconds. Pure CSS animation so it costs nothing on the JS
 * thread. Paused when the user prefers reduced motion.
 */
export function Marquee({
  items,
  duration = 60,
  className,
}: {
  items: string[];
  duration?: number;
  className?: string;
}) {
  return (
    <div className={className} aria-hidden>
      <div
        className="marquee-track flex min-w-max gap-16 whitespace-nowrap"
        style={{ animationDuration: `${duration}s` }}
      >
        {[...items, ...items].map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="font-serif text-4xl italic text-muted-foreground/25 md:text-6xl"
          >
            {item}
            <span className="mx-10 text-primary/30">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
