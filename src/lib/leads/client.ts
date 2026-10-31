import { leadTypeLabels, type LeadResponse, type LeadType } from "./schema";

/**
 * Browser-side lead submission.
 *
 *  • Server hosting (Vercel / Node): posts to this site's own `/api/leads`,
 *    which forwards to Telegram / webhook / e-mail (see deliver.ts).
 *  • Static hosting (GitHub Pages): there is no server, so the form posts
 *    directly to a form service configured at build time:
 *      NEXT_PUBLIC_LEADS_ENDPOINT    e.g. https://formspree.io/f/abcd1234
 *                                    or   https://api.web3forms.com/submit
 *      NEXT_PUBLIC_LEADS_ACCESS_KEY  (Web3Forms access key; public by design)
 *    Without an endpoint the form reports "not configured" — it never fakes
 *    a successful submission.
 */
const isStatic = process.env.NEXT_PUBLIC_STATIC_EXPORT === "true";
const endpoint = process.env.NEXT_PUBLIC_LEADS_ENDPOINT;
const accessKey = process.env.NEXT_PUBLIC_LEADS_ACCESS_KEY;

export async function submitLead(data: Record<string, string>): Promise<{ ok: boolean; body: LeadResponse | null }> {
  if (!endpoint) {
    if (isStatic) return { ok: false, body: { ok: false, code: "not_configured" } };
    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = (await res.json().catch(() => null)) as LeadResponse | null;
    return { ok: res.ok && Boolean(body?.ok), body };
  }

  // Honeypot filled → drop silently (bots only).
  if (data.website) return { ok: true, body: { ok: true } };
  const { website: _hp, ...fields } = data;
  void _hp;
  const subject = `${leadTypeLabels[data.type as LeadType] ?? "Заявка"} — ${fields.name ?? ""}`;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...fields,
      typeLabel: leadTypeLabels[data.type as LeadType],
      page: window.location.href,
      subject,
      _subject: subject,
      ...(accessKey ? { access_key: accessKey } : {}),
    }),
  });
  const json = (await res.json().catch(() => null)) as { success?: boolean; ok?: boolean } | null;
  // Formspree → { ok: true }, Web3Forms → { success: true }; plain webhooks → any 2xx.
  const ok = res.ok && (json === null || json.ok !== false) && json?.success !== false;
  return { ok, body: ok ? { ok: true } : { ok: false, code: "delivery_failed" } };
}
