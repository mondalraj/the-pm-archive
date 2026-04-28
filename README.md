# P.M. Archive

A newsletter-archive site that condenses high-signal PM newsletters into short, well-formatted summaries.

**Stack:** Next.js 16 (App Router, RSC) · React 19 · TypeScript · Tailwind v4 · Prisma · Supabase Postgres · `motion` · `next-themes`.

The full database design and rationale lives in [PLAN.md](PLAN.md). This README covers how to run, navigate, and extend the codebase.

---

## Quick start

```bash
# 1. Install
npm install

# 2. Environment — create a Supabase project, then copy the two
#    connection strings into a local .env file (gitignored).
cp .env.example .env   # if .env.example doesn't exist, see "Environment" below

# 3. Sync the Prisma schema with the live Supabase database (one-time
#    on a fresh DB, and any time you change prisma/schema.prisma).
npx prisma db push

# 4. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The database starts empty. Add content via the Supabase Table Editor (see [Adding content](#adding-content)) — there is no seed script.

### Environment

Create `.env` at the project root with two Supabase connection strings:

```bash
# Pooled (Supavisor :6543) — used by the app at runtime.
DATABASE_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct (:5432) — used by `prisma db push`, `prisma studio`, introspection.
DIRECT_URL="postgresql://postgres.<ref>:<password>@aws-0-<region>.pooler.supabase.com:5432/postgres"

# Public site URL (used by sitemap, robots, OG metadata).
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

Both URLs are visible in Supabase under **Project Settings → Database → Connection string**. Both are required: Prisma's runtime client uses the pooled URL; the Prisma CLI uses the direct URL for DDL.

### Useful commands

| Command | Purpose |
|---|---|
| `npm run dev` | Start the Next.js dev server with Turbopack. |
| `npm run build` | Production build. |
| `npm run start` | Start the production server. |
| `npm run lint` | ESLint over the project. |
| `npx prisma db push` | Apply [prisma/schema.prisma](prisma/schema.prisma) directly to Supabase. Auto-runs `prisma generate`. |
| `npx prisma generate` | Regenerate the typed Prisma client (rarely needed standalone). |
| `npx prisma studio` | GUI for browsing/editing the DB locally. |

---

## Project structure

```
prisma/
  schema.prisma           # source of truth for DB schema (Article, Tag, indexes)
src/
  app/                    # Next.js App Router (RSC by default)
    layout.tsx            # root layout, fonts, theme provider
    page.tsx              # home — hero + Latest Articles + topics
    globals.css           # Tailwind v4 + theme tokens
    sitemap.ts            # /sitemap.xml — generated from articles
    robots.ts             # /robots.txt
    api/newsletter/subscribe/route.ts  # email-subscribe endpoint
    articles/
      page.tsx            # /articles — full archive
      [slug]/page.tsx     # /articles/<slug> — article detail (markdown body)
    topics/page.tsx       # /topics — tag/topic explorer
  components/
    articles/             # article-header, article-body (react-markdown),
                          # articles-list, author-card, related-articles,
                          # reading-progress
    home/                 # hero, featured-card, standard-card,
                          # latest-articles
    layout/               # site-header, site-footer
    motion/               # interactive-grid, magnetic-link, marquee,
                          # reveal, split-headline (motion / framer)
    newsletter/           # email-subscription CTA + form
                          # (distinct from the Article entity)
    theme/                # next-themes provider + toggle
    topics/               # topics-explorer
    ui/                   # ambient-backdrop, button, container,
                          # grain-overlay
  config/
    site.ts               # site-wide metadata (name, nav, footer)
  lib/
    prisma.ts             # singleton PrismaClient (hot-reload-safe)
    articles.ts           # the ONLY data-access layer for articles + tags
    seo.ts                # metadata helpers
    fonts.ts              # next/font setup
    utils.ts              # cn() and friends
  types/
    article.ts            # Article + ArticleSummary + ArticleTag
public/                   # static assets
next.config.ts            # remote image patterns + project config
PLAN.md                   # database design & rationale
```

### Key boundaries

- **No Prisma usage outside `src/lib/`.** Pages and components import from [src/lib/articles.ts](src/lib/articles.ts) only. This keeps Prisma types out of the component graph and keeps the data layer swappable.
- **RSC by default.** Page files (`src/app/**/page.tsx`) are server components and call `await getAllArticles()` etc. directly. Client components are explicitly marked with `"use client"`.
- **Markdown rendering.** Article bodies are stored as Markdown in `article.content_markdown` and rendered with `react-markdown` + `remark-gfm` in [src/components/articles/article-body.tsx](src/components/articles/article-body.tsx).
- **"Newsletter" terminology is reserved for the email-subscribe CTA** ([src/components/newsletter/](src/components/newsletter/) and the `/api/newsletter/subscribe` route). The content domain entity is **Article** everywhere — model, table, types, components, indexes.

---

## Database workflow

The schema file is the source of truth. There are no migration files.

```
edit prisma/schema.prisma
        │
        ▼
npx prisma db push            ← applies DDL directly to Supabase, then auto-runs prisma generate
        │
        ▼
verify in Supabase Table Editor / Prisma Studio
```

Two live tables plus an implicit M:N join:

- **`tag`** — id, name (unique), createdAt, updatedAt
- **`article`** — id, slug (unique), title, image_url, description, content_markdown, source_name, author_name, original_url, time_to_read, createdAt, updatedAt
- **`_ArticleTags(A, B)`** — Prisma-managed M:N join

Indexes are documented in [PLAN.md §3](PLAN.md). Highlights:
- `article_created_at_desc_idx` — listing pages need no `Sort` node.
- `article_title_trgm_idx`, `tag_name_trgm_idx` — GIN + `pg_trgm` so `ILIKE '%term%'` queries hit an index.

### Verifying performance

Open Supabase SQL editor:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, slug, title FROM article
ORDER BY created_at DESC LIMIT 12;
-- Expect: Index Scan using article_created_at_desc_idx (no Sort node).

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title FROM article WHERE title ILIKE '%loop%';
-- Expect: Bitmap Index Scan on article_title_trgm_idx.
```

---

## Adding content

The DB starts empty. Two ways to add rows:

### Supabase Table Editor (recommended)

1. Open your Supabase project → **Table Editor**.
2. Insert rows into `tag` first (e.g. `growth`, `strategy`).
3. Insert a row into `article`:
   - `slug` — URL-friendly, unique (e.g. `building-growth-loops`).
   - `title`, `description`, `source_name` (e.g. "Lenny's Newsletter"), `author_name`, `original_url`, `time_to_read`.
   - `image_url` — any HTTPS URL ([next.config.ts](next.config.ts) is configured to allow all HTTPS hosts via `images.remotePatterns`).
   - `content_markdown` — the article body as Markdown (GFM is supported).
4. Open the article row and use the relations panel to attach tags via `_ArticleTags`.

### Prisma Studio

```bash
npx prisma studio
```

Same idea, locally.

---

## Adding a new model

1. Edit [prisma/schema.prisma](prisma/schema.prisma) to add the model and any indexes (B-tree by default; GIN + `gin_trgm_ops` for substring search on text columns).
2. Run `npx prisma db push`. Verify the table and indexes appear in Supabase.
3. Add a data-access module under `src/lib/<entity>.ts`. Mirror the pattern in [src/lib/articles.ts](src/lib/articles.ts):
   - Define a `*Select` constant with `satisfies Prisma.<Entity>Select`.
   - Use `Prisma.<Entity>GetPayload<{ select: typeof xSelect }>` for the row type.
   - Map DB rows → domain types at this boundary (e.g. `Date` → ISO string for RSC payload safety).
4. Define the domain type in `src/types/<entity>.ts`.
5. Consume from server components via `await get<Entity>(…)`.

---

## Email-subscription CTA

The marketing-section "Newsletter" subscribe form (your own digest) is intentionally unrelated to the `Article` entity:

- UI: [src/components/newsletter/](src/components/newsletter/)
- API route: [src/app/api/newsletter/subscribe/route.ts](src/app/api/newsletter/subscribe/route.ts)
- Nav label "Newsletter" in [src/config/site.ts](src/config/site.ts) targets the on-page anchor.

Wire it to your provider of choice (Resend, ConvertKit, Buttondown, …) inside the API route.

---

## Deployment notes

- Deploy on Vercel; mirror `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SITE_URL` as project env vars.
- Schema pushes happen from a developer machine, not from CI. The build does not run `prisma db push`. The Prisma client is generated via `prisma generate` (Next.js postinstall convention).
- Rotate the Supabase DB password if `.env` was ever shared.

---

## Further reading

- [PLAN.md](PLAN.md) — full DB design, indexing rationale, performance practices, future scope (auth, RLS, storage, realtime, full-text search upgrade).
