import { NextResponse } from "next/server";

// This is NOT the Next.js you know — Route Handlers use the Web Request/
// Response API directly. See node_modules/next/dist/docs/ for details.

export const runtime = "edge";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * POST /api/newsletter/subscribe
 *
 * Minimal stub: validates the email shape and returns success. Replace
 * with the real provider integration (Resend, ConvertKit, Loops…) when
 * credentials are wired up.
 */
export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  const email =
    body && typeof body === "object" && "email" in body
      ? String((body as { email: unknown }).email ?? "").trim()
      : "";

  if (!email || !EMAIL_REGEX.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 422 },
    );
  }

  // TODO: forward `email` to the newsletter provider.
  // Log at most a masked hint for debugging; never log the full address.
  if (process.env.NODE_ENV !== "production") {
    const [localPart, domain] = email.split("@");
    console.info(
      `[newsletter] subscribed ${localPart.slice(0, 2)}***@${domain}`,
    );
  }

  return NextResponse.json({ ok: true });
}
