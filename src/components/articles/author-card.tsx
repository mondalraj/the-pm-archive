/**
 * Compact byline shown at the foot of an article. The schema only exposes
 * `authorName`; richer profiles will land alongside the future `profile`
 * table.
 */
export function AuthorCard({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <div className="mt-16 flex flex-col gap-5 border border-border bg-surface-elevated p-6 sm:flex-row sm:gap-6 sm:p-8">
      <div
        aria-hidden
        className="flex size-16 shrink-0 items-center justify-center border border-border-strong bg-surface font-serif text-xl font-medium text-foreground"
      >
        {initials}
      </div>
      <div>
        <p className="label-caps mb-1 text-primary">Author</p>
        <p className="font-serif text-2xl font-medium leading-tight text-foreground">
          {name}
        </p>
      </div>
    </div>
  );
}
