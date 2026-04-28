import { NextRequest } from "next/server";
import { getArticlesPage } from "@/lib/articles";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const offset = parseInt(searchParams.get("offset") || "0", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    if (isNaN(offset) || isNaN(limit) || limit < 1 || offset < 0) {
      return new Response(JSON.stringify({ error: "Invalid offset or limit" }), { status: 400 });
    }
    const { articles, hasMore } = await getArticlesPage({ offset, limit });
    return Response.json({ articles, hasMore });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch articles" }), { status: 500 });
  }
}
