import "server-only";
import { site } from "@/data/site";
import { leadFieldLabels, leadTypeLabels, type Lead } from "./schema";

/**
 * Lead delivery. Configure at least one channel through environment
 * variables (see .env.example). If none is configured the API answers
 * `not_configured` and the form tells the visitor so — a submission is
 * never reported as successful unless a channel accepted it.
 *
 *  • Telegram:  TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID
 *  • Webhook:   LEADS_WEBHOOK_URL (+ optional LEADS_WEBHOOK_SECRET)
 *               — e.g. Make, Zapier, n8n, Google Apps Script, a CRM.
 *  • E-mail:    RESEND_API_KEY + LEADS_EMAIL_TO (+ LEADS_EMAIL_FROM)
 */

type Channel = { name: string; send: (lead: Lead, meta: LeadMeta) => Promise<void> };
export type LeadMeta = { page: string | null; receivedAt: string };

function entries(lead: Lead) {
  return Object.entries(lead)
    .filter(([k, v]) => k !== "type" && k !== "website" && typeof v === "string" && v.trim() !== "")
    .map(([k, v]) => [leadFieldLabels[k] ?? k, v as string] as const);
}

function escapeHtml(s: string) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function asText(lead: Lead, meta: LeadMeta) {
  const lines = entries(lead).map(([k, v]) => `${k}: ${v}`);
  return [`${leadTypeLabels[lead.type]} — ${site.name}`, "", ...lines, "", `Страница: ${meta.page ?? "—"}`].join("\n");
}

function asHtml(lead: Lead, meta: LeadMeta) {
  const lines = entries(lead).map(([k, v]) => `<b>${escapeHtml(k)}:</b> ${escapeHtml(v)}`);
  return [
    `<b>${escapeHtml(leadTypeLabels[lead.type])}</b>`,
    "",
    ...lines,
    "",
    `<i>Страница: ${escapeHtml(meta.page ?? "—")}</i>`,
  ].join("\n");
}

async function assertOk(res: Response, channel: string) {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`${channel} responded ${res.status}: ${body.slice(0, 200)}`);
  }
}

function configuredChannels(): Channel[] {
  const channels: Channel[] = [];
  const env = process.env;

  if (env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID) {
    channels.push({
      name: "telegram",
      async send(lead, meta) {
        const res = await fetch(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            chat_id: env.TELEGRAM_CHAT_ID,
            text: asHtml(lead, meta),
            parse_mode: "HTML",
            disable_web_page_preview: true,
          }),
          signal: AbortSignal.timeout(8000),
        });
        await assertOk(res, "Telegram");
      },
    });
  }

  if (env.LEADS_WEBHOOK_URL) {
    channels.push({
      name: "webhook",
      async send(lead, meta) {
        const { website: _hp, ...data } = lead as Lead & { website?: string };
        void _hp;
        const res = await fetch(env.LEADS_WEBHOOK_URL!, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(env.LEADS_WEBHOOK_SECRET ? { Authorization: `Bearer ${env.LEADS_WEBHOOK_SECRET}` } : {}),
          },
          body: JSON.stringify({ ...data, typeLabel: leadTypeLabels[lead.type], ...meta, site: site.url }),
          signal: AbortSignal.timeout(8000),
        });
        await assertOk(res, "Webhook");
      },
    });
  }

  if (env.RESEND_API_KEY && env.LEADS_EMAIL_TO) {
    channels.push({
      name: "email",
      async send(lead, meta) {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: env.LEADS_EMAIL_FROM ?? "Заявки с сайта <onboarding@resend.dev>",
            to: env.LEADS_EMAIL_TO!.split(",").map((s) => s.trim()),
            subject: `${leadTypeLabels[lead.type]} — ${lead.name}`,
            text: asText(lead, meta),
          }),
          signal: AbortSignal.timeout(8000),
        });
        await assertOk(res, "Resend");
      },
    });
  }

  return channels;
}

export function isDeliveryConfigured() {
  return configuredChannels().length > 0;
}

export async function deliverLead(lead: Lead, meta: LeadMeta) {
  const channels = configuredChannels();
  if (channels.length === 0) return { status: "not_configured" as const };

  const results = await Promise.allSettled(channels.map((c) => c.send(lead, meta)));
  const delivered = results.filter((r) => r.status === "fulfilled").length;
  results.forEach((r, i) => {
    if (r.status === "rejected") console.error(`[leads] ${channels[i].name} failed:`, r.reason);
  });
  return delivered > 0 ? { status: "ok" as const } : { status: "failed" as const };
}
