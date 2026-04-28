import fs from "node:fs/promises";
import path from "node:path";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ROOT = process.cwd();
const SUMMARIES_DIR = path.join(ROOT, "newsletter-summaries");
const INDEX_PATH = path.join(SUMMARIES_DIR, "INDEX.md");
const TODAY = new Date().toISOString().slice(0, 10);
const DEBUG = process.env.DEBUG_IMPORT === "1";

function debugLog(...args) {
  if (DEBUG) console.error("[import-debug]", ...args);
}

const TAG_RULES = [
  { tag: "AI", rx: /\bai\b|artificial intelligence|llm|model/i, weight: 8 },
  { tag: "AI_AGENTS", rx: /agent\b|agents\b|agentic/i, weight: 10 },
  { tag: "ENGINEERING", rx: /engineering|developer|dev team|codebase|software/i, weight: 8 },
  { tag: "PRODUCT", rx: /product\b|roadmap|pm\b|product manager/i, weight: 8 },
  { tag: "GROWTH", rx: /growth|retention|acquisition|conversion|funnel/i, weight: 7 },
  { tag: "STARTUPS", rx: /startup|founder|seed-stage|venture|vc\b/i, weight: 7 },
  { tag: "LEADERSHIP", rx: /leadership|manager|organizational|culture/i, weight: 6 },
  { tag: "SECURITY", rx: /security|secrets|threat|sandbox|prompt injection/i, weight: 9 },
  { tag: "CI_CD", rx: /ci\/cd|github actions|pipeline|deployment/i, weight: 6 },
  { tag: "GITHUB", rx: /github|pull request|pr\b|repository/i, weight: 7 },
  { tag: "AUTOMATION", rx: /automation|workflow|orchestrator|production line/i, weight: 7 },
  { tag: "DISTRIBUTION", rx: /distribution|audience|go-to-market|visibility/i, weight: 8 },
  { tag: "CONTENT", rx: /content|script|youtube|creator/i, weight: 6 },
  { tag: "DEVTOOLS", rx: /tooling|developer tools|cli\b|cursor|claude code/i, weight: 7 },
  { tag: "OBSERVABILITY", rx: /observability|telemetry|monitoring|honeycomb|signoz/i, weight: 6 },
];

const TAG_FALLBACK_PRIORITY = [
  "AI",
  "ENGINEERING",
  "PRODUCT",
  "GROWTH",
  "STARTUPS",
  "LEADERSHIP",
  "AUTOMATION",
  "DEVTOOLS",
  "CONTENT",
  "DISTRIBUTION",
  "SECURITY",
  "GITHUB",
  "CI_CD",
  "OBSERVABILITY",
];

function normalizeWhitespace(text) {
  return text.replace(/\s+/g, " ").trim();
}

function slugifyTitle(title) {
  return title
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function extractTitle(markdown, fallbackFileName) {
  const m = markdown.match(/^#\s+(.+)$/m);
  if (m?.[1]) return m[1].trim();
  return fallbackFileName
    .replace(/\.md$/i, "")
    .replace(/^\d{4}-\d{2}-\d{2}-/, "")
    .replace(/-/g, " ")
    .replace(/\b\w/g, (ch) => ch.toUpperCase());
}

function extractOriginalUrl(markdown) {
  const byLabel = markdown.match(/\[(?:Original|Original link|Original article)\]\((https?:\/\/[^)\s]+)\)/i);
  if (byLabel?.[1]) return byLabel[1];

  const byMeta = markdown.match(/Original\s*:?[^\n]*\((https?:\/\/[^)\s]+)\)/i);
  if (byMeta?.[1]) return byMeta[1];

  const firstUrl = markdown.match(/https?:\/\/[^\s)]+/i);
  return firstUrl?.[0] ?? "";
}

function extractImageUrl(markdown) {
  const img = markdown.match(/!\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/i);
  return img?.[1] ?? "";
}

function parseMetadataDate(rawDate) {
  const normalizedDate = normalizeWhitespace(rawDate ?? "");
  const isoDate = normalizedDate.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  if (isoDate?.[1]) return isoDate[1];

  const parsed = new Date(`${normalizedDate} UTC`);
  if (!Number.isNaN(parsed.getTime())) return parsed.toISOString().slice(0, 10);

  return TODAY;
}

function extractMeta(markdown) {
  const metadataWindow = markdown
    .split("\n")
    .slice(0, 30)
    .join("\n")
    .replace(/\*\*/g, "")
    .replace(/\*(?=\S)|(?<=\S)\*/g, "");

  const sourceMatch = metadataWindow.match(/Source:\s*([^\n\r·•—|]+)/i);
  const authorMatch = metadataWindow.match(/Authors?:\s*([^\n\r·•—|]+)/i);
  const dateMatch = metadataWindow.match(/Date:\s*([^\n\r·•—|]+)/i);

  return {
    sourceName: normalizeWhitespace(sourceMatch?.[1] ?? "Unknown Source"),
    authorName: normalizeWhitespace(authorMatch?.[1] ?? "Unknown Author"),
    dateStr: parseMetadataDate(dateMatch?.[1]),
  };
}

function extractDescription(markdown) {
  const paragraphs = markdown
    .split(/\n\s*\n/g)
    .map((p) => p.trim())
    .filter(Boolean);

  for (const p of paragraphs) {
    if (
      p.startsWith("#") ||
      p.startsWith("**Source:") ||
      p.startsWith("*Source:") ||
      p.startsWith("---") ||
      p.startsWith(">") ||
      p.startsWith("![")
    ) {
      continue;
    }

    const normalized = normalizeWhitespace(p.replace(/[*_`>#\[\]]/g, " "));
    if (normalized.length >= 80) {
      return normalized.slice(0, 280);
    }
  }

  return "Practical insights for builders from this issue.";
}

function countWords(markdown) {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_~\-]/g, " ");

  const words = plain.split(/\s+/).filter(Boolean);
  return words.length;
}

function deriveTags(title, markdown) {
  const text = `${title}\n${markdown}`;
  const titleLower = title.toLowerCase();

  const scored = TAG_RULES.map((rule) => {
    const matches = text.match(new RegExp(rule.rx.source, "gi")) ?? [];
    const matchScore = matches.length * rule.weight;
    const titleBoost = rule.rx.test(titleLower) ? Math.ceil(rule.weight * 1.5) : 0;
    return {
      tag: rule.tag,
      score: matchScore + titleBoost,
    };
  }).filter((x) => x.score > 0);

  scored.sort((a, b) => b.score - a.score || a.tag.localeCompare(b.tag));

  const strongest = scored.slice(0, 6).map((x) => x.tag);
  const uniqueStrongest = [...new Set(strongest)];

  if (uniqueStrongest.length >= 4) return uniqueStrongest;

  const padding = TAG_FALLBACK_PRIORITY.filter((tag) => !uniqueStrongest.includes(tag));
  return [...uniqueStrongest, ...padding].slice(0, 4);
}

async function resolveUniqueSlug(baseSlug) {
  let slug = baseSlug;
  let suffix = 2;

  while (true) {
    const exists = await prisma.article.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!exists) return slug;
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}

async function resolveTags(tagNames) {
  const existing = await prisma.tag.findMany({
    where: { name: { in: tagNames } },
    select: { id: true, name: true },
  });

  const existingSet = new Set(existing.map((t) => t.name));
  const missing = tagNames.filter((name) => !existingSet.has(name));

  if (missing.length > 0) {
    await prisma.tag.createMany({
      data: missing.map((name) => ({ name })),
      skipDuplicates: true,
    });
  }

  const all = await prisma.tag.findMany({
    where: { name: { in: tagNames } },
    select: { id: true, name: true },
  });

  return {
    all,
    createdCount: missing.length,
    reusedCount: tagNames.length - missing.length,
  };
}

async function getMarkdownPathsFromIndex() {
  const indexContent = await fs.readFile(INDEX_PATH, "utf8");
  const matches = [...indexContent.matchAll(/\[[^\]]+\]\(([^)]+\.md)\)/g)];
  const relPaths = matches.map((m) => m[1]);
  return relPaths.map((rel) => path.join(SUMMARIES_DIR, rel));
}

async function main() {
  const paths = await getMarkdownPathsFromIndex();

  const summary = {
    filesProcessed: paths.length,
    articlesCreated: 0,
    articlesUpdatedDuplicateSource: 0,
    tagsCreated: 0,
    tagsReused: 0,
    items: [],
  };

  for (const filePath of paths) {
    debugLog("processing", path.basename(filePath));
    const markdown = await fs.readFile(filePath, "utf8");
    const fileName = path.basename(filePath);

    const title = extractTitle(markdown, fileName);
    const meta = extractMeta(markdown);
    const originalUrl = extractOriginalUrl(markdown);
    const imageUrl = extractImageUrl(markdown);
    const description = extractDescription(markdown);
    const timeToRead = Math.max(1, Math.ceil(countWords(markdown) / 220));

    const duplicateBySource = originalUrl
      ? await prisma.article.findFirst({
          where: { originalUrl },
          select: { id: true, slug: true },
        })
      : null;

    if (duplicateBySource) {
      debugLog("updating existing by originalUrl", originalUrl);
      const tagNames = deriveTags(title, markdown);
      const { all: tags, createdCount, reusedCount } = await resolveTags(tagNames);
      summary.tagsCreated += createdCount;
      summary.tagsReused += reusedCount;

      const createdAt = new Date(`${meta.dateStr}T00:00:00.000Z`);

      await prisma.article.update({
        where: { id: duplicateBySource.id },
        data: {
          title,
          imageUrl,
          description,
          contentMarkdown: markdown,
          sourceName: meta.sourceName,
          authorName: meta.authorName,
          originalUrl,
          timeToRead,
          createdAt,
          tags: {
            set: tags.map((t) => ({ id: t.id })),
          },
        },
      });
      debugLog("updated", duplicateBySource.slug);

      summary.articlesUpdatedDuplicateSource += 1;
      summary.items.push({
        title,
        action: "updated_duplicate_source",
        existingSlug: duplicateBySource.slug,
        originalUrl,
        sourceName: meta.sourceName,
        authorName: meta.authorName,
        imageUrl,
        tags: tagNames,
      });
      continue;
    }

    const baseSlug = `${TODAY}-${slugifyTitle(title)}`;
    const slug = await resolveUniqueSlug(baseSlug);
    debugLog("creating new article", slug);

    const tagNames = deriveTags(title, markdown);
    const { all: tags, createdCount, reusedCount } = await resolveTags(tagNames);
    summary.tagsCreated += createdCount;
    summary.tagsReused += reusedCount;

    const createdAt = new Date(`${meta.dateStr}T00:00:00.000Z`);

    await prisma.article.create({
      data: {
        slug,
        title,
        imageUrl,
        description,
        contentMarkdown: markdown,
        sourceName: meta.sourceName,
        authorName: meta.authorName,
        originalUrl,
        timeToRead,
        createdAt,
        tags: {
          connect: tags.map((t) => ({ id: t.id })),
        },
      },
      select: { id: true },
    });
    debugLog("created", slug);

    summary.articlesCreated += 1;
    summary.items.push({
      title,
      action: "created",
      slug,
      sourceName: meta.sourceName,
      authorName: meta.authorName,
      originalUrl,
      imageUrl,
      timeToRead,
      tags: tagNames,
    });
  }

  console.log(JSON.stringify(summary, null, 2));
  debugLog("completed");
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
