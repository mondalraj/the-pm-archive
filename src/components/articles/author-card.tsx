import type { Author } from "@/types/article";

export function AuthorCard({ author }: { author: Author }) {
  const initials = author.name
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
        <p className="label-caps mb-1 text-primary">
          {author.role ?? "Contributor"}
        </p>
        <p className="font-serif text-2xl font-medium leading-tight text-foreground">
          {author.name}
        </p>
        {author.bio ? (
          <p className="mt-3 text-muted-foreground">{author.bio}</p>
        ) : null}
      </div>
    </div>
  );
}
