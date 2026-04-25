# Newsletter Summaries -> Supabase Migration Plan

## Purpose

This document defines the repeatable workflow for importing newsletter summary markdown files from `newsletter-summaries/` into the database tables behind Prisma models `Article` and `Tag`.

Schema reference: `prisma/schema.prisma`

- `Article` fields used: `slug`, `title`, `imageUrl`, `description`, `contentMarkdown`, `sourceName`, `authorName`, `originalUrl`, `timeToRead`, `createdAt`, `updatedAt`, `tags`
- `Tag` uniqueness key: `name` (`@unique`)

## Input Source

- Index file: `newsletter-summaries/INDEX.md`
- Content files: all linked markdown files under `newsletter-summaries/`

## Confirmed Rules (from user)

1. Image handling:
- Scan the full markdown content.
- If any image URL exists in the markdown, use the first discovered image URL as `imageUrl`.
- If no image exists, keep `imageUrl` empty (`""`).

2. Slug policy:
- Slug must be unique.
- Build slug from today's date + normalized title, inspired by newsletter filename patterns.
- Format:
  - `YYYY-MM-DD-<title-slug>`
  - Example: `2026-04-25-the-security-architecture-of-github-agentic-workflow`
- If collision occurs, append numeric suffix:
  - `YYYY-MM-DD-<title-slug>-2`, `-3`, etc.

3. Tag policy:
- Canonical tag format must be full uppercase with underscores.
- Examples:
  - `PRODUCT_STRATEGY`
  - `AI_ENGINEERING`
  - `STARTUP_OPERATIONS`
- Tag count should be capped to the strongest `4` to `6` tags per article.
- For each canonical tag:
  - If tag exists, reuse/connect.
  - If not, create and connect.

## Field Mapping Strategy

For each markdown file:

- `title`:
  - Extract from first H1 line (`# ...`).

- `contentMarkdown`:
  - Store full markdown file as-is (no rewriting, no summarization).

- `sourceName`, `authorName`, `originalUrl`:
  - Parse from metadata lines near top, e.g.:
    - `Source: ...`
    - `Author: ...`
    - `Original: ...` or `Original link`

- `createdAt`:
  - Prefer date parsed from metadata (`Date:`) when valid.
  - Fallback to import execution date.

- `updatedAt`:
  - Leave automatic (`@updatedAt`) handled by Prisma.

- `description`:
  - Use first meaningful paragraph after metadata block.
  - Normalize whitespace and trim.
  - Keep concise (target <= 280 characters when possible).

- `imageUrl`:
  - Extract first markdown image URL `![...](...)` anywhere in file.
  - If none: `""`.

- `timeToRead`:
  - Compute from content word count.
  - Formula: `max(1, ceil(words / 220))`.

- `slug`:
  - Build from today's date and normalized title (see slug policy).
  - Ensure uniqueness before insert.

- `tags`:
  - Derive candidate topic tags from title + content keywords.
  - Canonicalize to uppercase underscore.
  - Rank by strength (keyword frequency + title relevance boost).
  - Keep only top `4` to `6` strongest tags per article.
  - De-duplicate in-memory before DB operations.

## Canonicalization Rules

### Slug normalization

1. Lowercase title.
2. Remove punctuation/special characters.
3. Replace spaces with `-`.
4. Collapse multiple dashes.
5. Trim leading/trailing dashes.
6. Prefix with current date `YYYY-MM-DD-`.

### Tag normalization

1. Trim surrounding whitespace.
2. Replace `&` with `AND`.
3. Replace non-alphanumeric separators with `_`.
4. Collapse multiple `_`.
5. Uppercase entire string.
6. Trim leading/trailing `_`.

## Database Write Workflow

Use Prisma client in a one-off import script.

For each article:

1. Resolve unique slug:
- Generate base slug with date + title.
- Query `Article` for collision.
- If exists, increment suffix until free.

2. Resolve tags:
- Canonicalize all candidate tags.
- Score and rank tags by relevance.
- Keep only top `4` to `6` tags for the article.
- `findMany` existing tags by `name in (...)`.
- `createMany` missing tags with `skipDuplicates: true`.
- Re-fetch full tag set for connection IDs.

3. Create article:
- Insert with mapped fields.
- Connect tags through relation `ArticleTags`.

4. Idempotency safeguard:
- Before create, check whether an article already exists with same `originalUrl`.
- If found, update the existing row (content/fields/tags) instead of creating duplicates.

## Suggested Execution Steps

1. Ensure env is loaded (`DATABASE_URL`, `DIRECT_URL`).
2. Run import script against production DB.
3. Output operation summary.

Expected summary fields:
- files processed
- articles created
- articles updated (if duplicate source)
- tags created
- tags reused
- per-article slug + tag list

## Validation Queries (post-run)

1. Count imported records by date prefix in slug:
- `SELECT COUNT(*) FROM article WHERE slug LIKE '2026-04-25-%';`

2. Spot-check articles:
- `SELECT slug, title, source_name, author_name, original_url, time_to_read FROM article ORDER BY id DESC LIMIT 10;`

3. Verify tags and relationships:
- Join `article`, `_ArticleTags`, and `tag` to ensure every article has expected tag links.

## Safety Notes

- This is data import only; no schema change and no Prisma migration files.
- Do not mutate markdown bodies.
- Do not overwrite existing articles unless explicitly requested in a future operation.
- Keep a run log for each import session in terminal output.

## Future Reuse

For future imports, follow this same plan and only vary:
- source folder path
- date prefix used for slug generation
- optional duplicate policy (`originalUrl` update vs skip)

## Next Time: How To Upload New Newsletter Summaries

Use this exact workflow whenever you add new markdown summaries.

1. Add files:
- Put new `.md` summary files in `newsletter-summaries/`.
- Add each file to `newsletter-summaries/INDEX.md` using markdown links.

2. Confirm metadata in each markdown file:
- Include top metadata lines with `Source`, `Author`, `Date`, and `Original` (or `Original link`).
- Ensure one H1 title line exists (`# ...`).

3. Run importer from project root:
- `node --env-file=.env scripts/import-newsletter-summaries.mjs`

4. What importer does automatically:
- extracts and stores full markdown as `contentMarkdown`
- extracts first image URL if present, otherwise stores empty `imageUrl`
- generates unique slug (`YYYY-MM-DD-<title-slug>`, with suffix on collision)
- scores tags and keeps strongest `4` to `6`
- creates missing tags, reuses existing tags, then connects relations
- updates existing article when `originalUrl` already exists

5. Verify import quickly:
- check terminal JSON summary
- optional DB sanity check in SQL:
  - `SELECT slug, title, source_name, author_name FROM article ORDER BY id DESC LIMIT 20;`
  - verify tag relations for new slugs via join on `_ArticleTags`
