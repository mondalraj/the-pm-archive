# Database Plan — `the-pm-archive`

> **Status:** Implemented. This document records the design and the rationale; it is no longer a forward plan.
>
> Two tables are live on Supabase Postgres (`tag`, `article`) plus the implicit M:N join (`_ArticleTags`). Schema changes are made by editing [prisma/schema.prisma](prisma/schema.prisma) and running `npx prisma db push` directly against the production database. No migration files; the schema file is the source of truth.

---

## 1. Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Database engine | **PostgreSQL** (managed by Supabase) | Vanilla Postgres; pre-solves future auth/storage/realtime needs without adding vendors. |
| ORM | **Prisma** | Type-safe client, ergonomic schema, `db push` matches our "no migration files" workflow, ships Prisma Studio GUI. |
| Schema-change workflow | `npx prisma db push` from local against the prod DB | Solo-dev project; the schema file is the source of truth. We can adopt `prisma migrate` later via baselining if needed — not a one-way door. |
| Connection strategy | **Supavisor pooled URL** (port `6543`, `pgbouncer=true`) for runtime; **direct URL** (port `5432`) for Prisma CLI | Required for serverless Next.js runtime; Prisma CLI needs direct access for DDL during `db push`. |
| Naming | Domain entity is **Article** everywhere — model name, table name, types, components, indexes. | Single source of truth across DB and UI. The "Newsletter" CTA on the marketing site refers to the user's own email subscription, which is a distinct concept and intentionally untouched. |
| Data-access boundary | All DB I/O lives behind [src/lib/articles.ts](src/lib/articles.ts) (and future `src/lib/<entity>.ts` files). UI/pages never import Prisma directly. | Keeps Prisma types out of the component graph and the DB swappable. |

---

## 2. Schema (live)

File: [prisma/schema.prisma](prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")   // pooled (Supavisor) — used at runtime
  directUrl = env("DIRECT_URL")     // direct 5432 — used by `prisma db push`
}

model Tag {
  id        Int      @id @default(autoincrement())
  name      String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  articles Article[] @relation("ArticleTags")

  @@index([name(ops: raw("gin_trgm_ops"))], type: Gin, name: "tag_name_trgm_idx")
  @@map("tag")
}

model Article {
  id              Int      @id @default(autoincrement())
  slug            String   @unique
  title           String
  imageUrl        String   @map("image_url")
  description     String
  contentMarkdown String   @map("content_markdown")
  // Source publication this article was summarised from
  // (e.g. "Lenny's Newsletter"). Distinct from our own subscription CTA.
  sourceName      String   @map("source_name")
  authorName      String   @map("author_name")
  originalUrl     String   @map("original_url")
  timeToRead      Int      @map("time_to_read")
  tags            Tag[]    @relation("ArticleTags")
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([createdAt(sort: Desc)], name: "article_created_at_desc_idx")
  @@index([title(ops: raw("gin_trgm_ops"))], type: Gin, name: "article_title_trgm_idx")
  @@index([authorName], name: "article_author_name_idx")
  @@map("article")
}
```

### Naming conventions

- Prisma model names are PascalCase (`Tag`, `Article`); `@@map` keeps the Postgres table names exactly as `tag`, `article`.
- Field names are camelCase in TypeScript, snake_case in SQL via `@map`.
- The implicit M:N join table is `_ArticleTags(A, B)` with both columns indexed automatically. Promote it to an explicit model only when we need to add columns to the relation (e.g. `addedAt`, `position`).

---

## 3. Indexing strategy

### 3.1 Indexes that exist

| Index | Field(s) | Type | Purpose |
|---|---|---|---|
| `tag_pkey` | `tag.id` | B-tree (unique) | Primary key. |
| `tag_name_key` | `tag.name` | B-tree (unique) | Lookup-by-name + uniqueness. |
| `tag_name_trgm_idx` | `tag.name` | **GIN (pg_trgm)** | Substring/fuzzy search on tag names (autocomplete). |
| `article_pkey` | `article.id` | B-tree (unique) | Primary key. |
| `article_slug_key` | `article.slug` | B-tree (unique) | Detail-page lookup `WHERE slug = $1`. |
| `article_created_at_desc_idx` | `article.created_at DESC` | B-tree | Listing queries `ORDER BY created_at DESC LIMIT N` — no Sort node. |
| `article_title_trgm_idx` | `article.title` | **GIN (pg_trgm)** | Fast `ILIKE '%term%'` on titles. |
| `article_author_name_idx` | `article.author_name` | B-tree | Filter by author. |
| `_ArticleTags_AB_pkey` / `_ArticleTags_B_index` | join table | B-tree | Auto by Prisma — supports both directions of the M:N join. |

### 3.2 Why two trigram indexes specifically

Postgres B-tree indexes **cannot accelerate `ILIKE '%term%'` or `LIKE '%term%'`** queries — they only help with prefix patterns (`'term%'`). For substring/fuzzy search on `tag.name` and `article.title` we use the `pg_trgm` extension, which decomposes strings into 3-character grams and indexes them with **GIN**. This makes:

```sql
SELECT * FROM article WHERE title ILIKE '%growth loops%';
```

run in milliseconds even at hundreds of thousands of rows, and also unlocks similarity ranking (`ORDER BY similarity(title, $1) DESC`) for typo-tolerant search later.

### 3.3 Indexes deliberately not added

- **Full-text on `description` / `content_markdown`** — deferred. When we need real article search, we will add a generated `tsvector` column + GIN with `to_tsvector('english', ...)` (better ranking, language-aware) rather than trigram on long text.
- **Composite `(author_name, created_at DESC)`** — add only if `EXPLAIN` shows the planner choosing the wrong index for "articles by author, newest first".
- **Explicit index on `slug`** — already covered by `@unique`.

### 3.4 Verifying an index pays off

Use Supabase's Query Performance dashboard (`pg_stat_statements`) and `EXPLAIN (ANALYZE, BUFFERS)` in the SQL editor:

```sql
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, slug, title FROM article
ORDER BY created_at DESC LIMIT 12;
-- Expect: Index Scan using article_created_at_desc_idx (no Sort node).

EXPLAIN (ANALYZE, BUFFERS)
SELECT id, title FROM article WHERE title ILIKE '%loop%';
-- Expect: Bitmap Index Scan on article_title_trgm_idx (no Seq Scan).
```

---

## 4. Query patterns

Implemented in [src/lib/articles.ts](src/lib/articles.ts):

| Function | SQL pattern (conceptual) | Index used |
|---|---|---|
| `getAllArticles()` | `SELECT … FROM article ORDER BY created_at DESC` | `article_created_at_desc_idx` |
| `getArticleBySlug(slug)` | `SELECT … FROM article WHERE slug = $1` (+ tags joined) | `article_slug_key` |
| `getAllArticleSlugs()` | `SELECT slug FROM article ORDER BY created_at DESC` | `article_created_at_desc_idx` |
| `getRelatedArticles(slug, limit)` | two-step: (1) tag-overlap, (2) most-recent filler if short | join indexes + created_at index |
| `searchArticles(q, limit)` | `WHERE title ILIKE '%' \|\| $1 \|\| '%' ORDER BY created_at DESC` | `article_title_trgm_idx` |
| `getAllTags()` | `SELECT id, name FROM tag ORDER BY name ASC` | `tag_name_key` |

### 4.1 Performance practices in use

1. **`select` exactly what's needed** — list views never include `contentMarkdown`.
2. **Singleton `PrismaClient`** in [src/lib/prisma.ts](src/lib/prisma.ts) with the `globalThis` guard to survive Next.js dev hot-reload.
3. **`findUnique` over `findFirst`** when querying by unique fields — Prisma's dataloader batches concurrent calls.
4. **Connection pooling** — runtime uses Supavisor pooled URL (`?pgbouncer=true&connection_limit=1`). Prisma CLI uses `directUrl`.
5. **Two-query strategy for related articles** instead of one complex join — each plan is trivially index-driven.

### 4.2 Practices to apply when relevant

- **Cursor-based pagination** (`take`, `cursor: { id }`) over `skip` past page ~1000 — `OFFSET` is O(N).
- **`Prisma.$transaction([...])`** for multi-write flows (e.g. upsert tags + create article atomically).
- **Next.js `unstable_cache`** keyed by route + tag, with `revalidateTag('articles')` invoked on writes (admin path).

---

## 5. Postgres extensions enabled

```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
-- pg_stat_statements is on by default on Supabase.
```

`pgvector`, `pg_cron`, `postgis`, etc. — add only when a feature needs them.

---

## 6. Environment & secrets

`.env` (git-ignored):

```bash
# Pooled (Supavisor, port 6543) — used by the app at runtime.
DATABASE_URL="postgresql://postgres.<ref>:<pwd>@aws-0-<region>.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Direct (port 5432) — used by Prisma CLI for `db push`, introspection, Studio.
DIRECT_URL="postgresql://postgres.<ref>:<pwd>@aws-0-<region>.pooler.supabase.com:5432/postgres"
```

Production (Vercel): mirror both as project env vars. Never commit `.env*`.

---

## 7. Operational practices

- **Schema changes are reviewed.** Even with `db push`, the diff to `prisma/schema.prisma` is the source of truth — review it before pushing. For destructive changes (drop column / type change), `prisma db push` will warn; do not pass `--accept-data-loss` against prod without recording the reason.
- **Backups:** Supabase free-tier daily backups. Take a manual backup from the dashboard before any potentially destructive schema change.
- **Observability:** Supabase Query Performance + Logs. Add `log: ['query', 'warn', 'error']` on the Prisma client in dev only.
- **Safety:**
  - Wrap multi-write flows in `prisma.$transaction([...])`.
  - Validate all inbound payloads at API boundaries (Zod) before they reach Prisma.
  - Use Prisma parameterized queries; if raw is unavoidable, use `Prisma.sql` template tag, never string interpolation.
- **Migration escape hatch:** if/when we need audited history (multi-env, team), run `prisma migrate diff` to baseline existing prod state, then switch to `prisma migrate deploy`.

---

## 8. Future scope (deferred)

Intentionally out of scope for now; mentioned so today's choices don't paint us into a corner.

- **Auth & users:** Supabase Auth (`auth.users`, managed by Supabase). Add a `profile` table in `public` keyed by `auth.users.id` (UUID FK) for app-level user data, plus join tables like `bookmark`, `reaction`. Prisma models `profile` and references — never `auth.users` directly.
- **Row-Level Security (RLS):** When auth lands, every user-owned table gets RLS policies. Prisma uses the service role for trusted server contexts and a per-request JWT for user contexts.
- **File storage:** Supabase Storage buckets (e.g. `article-covers`, `avatars`); references stored as path strings on `article`/`profile`.
- **Realtime:** Postgres CDC via Supabase Realtime for live comment counts / reactions. May add denormalized counts (`reaction_count`) with a trigger.
- **Search upgrade:** when volume grows, swap title trigram for a `tsvector` generated column with weighted ranking across `title`, `description`, `content_markdown`.
