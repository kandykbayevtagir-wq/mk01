import { NextResponse, type NextRequest } from "next/server";
import { leadSchema, type LeadResponse } from "@/lib/leads/schema";
import { deliverLead } from "@/lib/leads/deliver";

/**
 * POST /api/leads — receives enrolment, partnership, appointment, product
 * and contact requests, validates them with the shared Zod schema and
 * forwards them to the configured delivery channels.
 */

// Best-effort in-memory rate limit (per server instance).
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function rateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

function json(body: LeadResponse, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return json({ ok: false, code: "bad_request" }, 400);
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    // Honeypot filled → silently drop (bots only; humans never see this field).
    if (parsed.error.issues.some((i) => i.path[0] === "website")) {
      return json({ ok: true }, 200);
    }
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] ??= issue.message;
    }
    return json({ ok: false, code: "validation", fieldErrors }, 422);
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (rateLimited(ip)) return json({ ok: false, code: "rate_limited" }, 429);

  const result = await deliverLead(parsed.data, {
    page: request.headers.get("referer"),
    receivedAt: new Date().toISOString(),
  });

  if (result.status === "not_configured") return json({ ok: false, code: "not_configured" }, 503);
  if (result.status === "failed") return json({ ok: false, code: "delivery_failed" }, 502);
  return json({ ok: true }, 200);
}
