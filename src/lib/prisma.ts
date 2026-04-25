import { PrismaClient } from "@prisma/client";

/**
 * Singleton PrismaClient.
 *
 * Next.js dev mode hot-reloads modules on every request, which would
 * otherwise instantiate a new PrismaClient (and a new connection pool)
 * each time and quickly exhaust Postgres connections. We stash the
 * client on `globalThis` so a single instance survives reloads.
 *
 * In production the module is loaded once per server instance, so the
 * `globalThis` cache is a no-op there.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function pickDatasourceUrl(): string {
  const pooled = process.env.DATABASE_URL;
  const direct = process.env.DIRECT_URL;

  // Build-time prerender can open many concurrent DB reads. Using the
  // direct connection here avoids pooler bottlenecks from tiny limits.
  const useDirect = process.env.PRISMA_FORCE_DIRECT_URL === "true";

  const url = useDirect ? direct ?? pooled : pooled ?? direct;

  if (!url) {
    throw new Error("Missing DATABASE_URL/DIRECT_URL for Prisma.");
  }

  return url;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasourceUrl: pickDatasourceUrl(),
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "warn", "error"]
        : ["warn", "error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
