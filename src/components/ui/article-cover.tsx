import { cn } from "@/lib/utils";

/**
 * Deterministic gradient placeholder used in lieu of hero imagery. Driven by
 * `hueSeed` on the article so each card feels distinct without relying on
 * external image hosts. Works in both themes.
 */
export function ArticleCover({
  hueSeed = 262,
  className,
  category,
}: {
  hueSeed?: number;
  className?: string;
  category?: string;
}) {
  const a = hueSeed;
  const b = (hueSeed + 48) % 360;
  const c = (hueSeed + 220) % 360;

  return (
    <div
      className={cn(
        "relative size-full overflow-hidden bg-surface-elevated",
        className,
      )}
      aria-hidden
      style={{
        backgroundImage: `
          radial-gradient(at 15% 20%, hsl(${a} 90% 60% / 0.85), transparent 55%),
          radial-gradient(at 85% 15%, hsl(${b} 85% 55% / 0.55), transparent 50%),
          radial-gradient(at 60% 85%, hsl(${c} 80% 35% / 0.75), transparent 60%)
        `,
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />
      {category ? (
        <span className="label-caps absolute bottom-5 left-5 text-white/90 mix-blend-plus-lighter">
          {category}
        </span>
      ) : null}
    </div>
  );
}
