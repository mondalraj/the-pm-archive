import Link from "next/link";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/container";

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-primary/20 bg-surface-elevated">
      <Container className="grid grid-cols-1 gap-12 py-16 md:grid-cols-3 md:py-24">
        <div className="space-y-4">
          <Link
            href="/"
            className="inline-flex font-serif text-xl font-semibold tracking-tight"
          >
            <span>{siteConfig.name.replace(/\.$/, "")}</span>
            <span className="text-primary">.</span>
          </Link>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            {siteConfig.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 md:col-span-2">
          <FooterColumn title="Explore" items={[...siteConfig.footerNav.explore]} />
          <FooterColumn title="Legal" items={[...siteConfig.footerNav.legal]} />
        </div>
      </Container>

      <div className="border-t border-border">
        <Container className="flex flex-col items-center justify-between gap-4 py-6 md:flex-row">
          <p className="label-caps text-muted-foreground">
            © {year} {siteConfig.name} All rights reserved.
          </p>
          <p className="label-caps text-muted-foreground">
            Published weekly — Made for operators
          </p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  items,
}: {
  title: string;
  items: ReadonlyArray<{ label: string; href: string }>;
}) {
  return (
    <div className="space-y-4">
      <h4 className="label-caps text-primary">{title}</h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-sm text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
