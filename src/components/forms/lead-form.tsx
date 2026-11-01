"use client";

import Link from "next/link";
import { useId, useRef, useState } from "react";
import { AlertCircle, Check, ChevronDown, Loader2 } from "lucide-react";
import { leadSchemas, type LeadType } from "@/lib/leads/schema";
import { submitLead } from "@/lib/leads/client";
import { channels, whatsappLink } from "@/data/site";
import { t } from "@/i18n";
import { cn } from "@/lib/utils";
import { ChannelTile } from "@/components/ui/brand-icons";
import { Button, ButtonLink } from "@/components/ui/button";

export type FieldDef = {
  name: string;
  label: string;
  kind: "text" | "tel" | "email" | "select" | "textarea";
  required?: boolean;
  placeholder?: string;
  autoComplete?: string;
  options?: { value: string; label: string }[];
  defaultValue?: string;
  /** Span both columns on wider screens. */
  wide?: boolean;
  hint?: string;
};

type Status = "idle" | "submitting" | "success" | "error";

/** Short, polite WhatsApp message built from what the visitor already typed. */
function fallbackMessage(type: LeadType, data: Record<string, string>) {
  const clip = (v?: string) => (v ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
  const name = clip(data.name);
  const intro =
    type === "course" && clip(data.course)
      ? `хочу записаться на курс «${clip(data.course)}».`
      : type === "partner"
        ? `хочу организовать обучение${clip(data.city) ? ` в городе ${clip(data.city)}` : ""}.`
        : type === "appointment"
          ? `хочу записаться в центр${clip(data.service) ? `: ${clip(data.service)}` : ""}.`
          : type === "product"
            ? `интересует продукция${clip(data.product) ? `: ${clip(data.product)}` : ""}.`
            : "у меня вопрос.";
  return `Здравствуйте! ${name ? `Меня зовут ${name}, ` : ""}${intro}`;
}

const fieldBase =
  "peer w-full rounded-2xl border bg-card px-4 text-base text-ink placeholder:text-muted/70 " +
  "transition-[border-color,box-shadow] duration-200 outline-none " +
  "focus:border-ink focus:shadow-[0_0_0_4px_rgb(23_23_23/0.06)]";

export function LeadForm({
  type,
  fields,
  submitLabel = t.form.submit,
  tone = "light",
  className,
  successText = t.form.successText,
}: {
  type: LeadType;
  fields: FieldDef[];
  submitLabel?: string;
  tone?: "light" | "mist";
  className?: string;
  successText?: string;
}) {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [attempted, setAttempted] = useState(false);
  const [lastData, setLastData] = useState<Record<string, string>>({});

  const schema = leadSchemas[type];

  function collect(form: HTMLFormElement) {
    const data: Record<string, string> = { type };
    new FormData(form).forEach((value, key) => {
      if (typeof value === "string") data[key] = value;
    });
    return data;
  }

  function validate(data: Record<string, string>) {
    const res = schema.safeParse(data);
    if (res.success) return {};
    const out: Record<string, string> = {};
    for (const issue of res.error.issues) {
      const key = String(issue.path[0]);
      out[key] ??= issue.message;
    }
    return out;
  }

  /**
   * After a failed submit, clear an error as soon as the field becomes
   * valid while typing. Errors are never added mid-typing, and nothing
   * changes on blur — so the layout doesn't shift under the cursor when
   * the visitor moves on to the submit button.
   */
  function onFormChange() {
    if (!attempted || !formRef.current || Object.keys(errors).length === 0) return;
    const current = validate(collect(formRef.current));
    const next: Record<string, string> = {};
    for (const key of Object.keys(errors)) if (current[key]) next[key] = current[key];
    if (Object.keys(next).length !== Object.keys(errors).length) setErrors(next);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setAttempted(true);
    const data = collect(form);
    const fieldErrors = validate(data);
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length) {
      const first = fields.find((f) => fieldErrors[f.name]);
      if (first) form.querySelector<HTMLElement>(`[name="${first.name}"]`)?.focus();
      return;
    }

    setLastData(data);
    setStatus("submitting");
    setErrorCode(null);
    try {
      const { ok, body } = await submitLead(data);
      if (ok) {
        setStatus("success");
        form.reset();
        requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }
      if (body && !body.ok && body.code === "validation" && body.fieldErrors) {
        setErrors(body.fieldErrors);
      }
      setErrorCode(body && !body.ok ? body.code : "delivery_failed");
      setStatus("error");
      requestAnimationFrame(() => statusRef.current?.focus());
    } catch {
      setErrorCode("network");
      setStatus("error");
      requestAnimationFrame(() => statusRef.current?.focus());
    }
  }

  if (status === "success") {
    return (
      <div
        ref={statusRef}
        tabIndex={-1}
        role="status"
        className={cn(
          "enter flex flex-col items-start outline-none",
          tone === "mist" ? "py-2" : "rounded-panel border border-line bg-mist p-6 sm:p-10",
          className,
        )}
      >
        <span className="inline-flex size-12 items-center justify-center rounded-full bg-ink text-white">
          <Check className="size-6" strokeWidth={2} aria-hidden />
        </span>
        <h3 className="mt-6 text-h3 font-semibold">{t.form.successTitle}</h3>
        <p className="mt-3 max-w-md text-muted">{successText}</p>
        <Button variant="outline" size="md" className="mt-8" onClick={() => setStatus("idle")}>
          {t.form.sendAnother}
        </Button>
      </div>
    );
  }

  const errorMessage =
    errorCode === "not_configured"
      ? t.form.errorNotConfigured
      : errorCode === "validation"
        ? t.form.errorValidation
        : errorCode === "rate_limited"
          ? t.form.errorRate
          : t.form.errorGeneric;

  return (
    <form
      ref={formRef}
      onSubmit={onSubmit}
      onChange={onFormChange}
      noValidate
      aria-describedby={status === "error" ? `${formId}-status` : undefined}
      className={cn("grid grid-cols-1 gap-x-4 gap-y-5 sm:grid-cols-2", className)}
    >
      {fields.map((f) => {
        const id = `${formId}-${f.name}`;
        const err = errors[f.name];
        const describedBy = [err && `${id}-error`, f.hint && `${id}-hint`].filter(Boolean).join(" ") || undefined;
        const common = {
          id,
          name: f.name,
          required: f.required,
          "aria-invalid": err ? true : undefined,
          "aria-describedby": describedBy,
          defaultValue: f.defaultValue,
        };
        const errorRing = err ? "border-danger focus:border-danger focus:shadow-[0_0_0_4px_rgb(179_38_45/0.1)]" : "border-line";
        return (
          <div key={f.name} className={cn("flex flex-col", (f.wide || f.kind === "textarea") && "sm:col-span-2")}>
            <label htmlFor={id} className="mb-2 text-sm font-medium text-ink">
              {f.label}
              {f.required && (
                <span className="ml-0.5 text-accent" aria-hidden>
                  *
                </span>
              )}
            </label>
            {f.kind === "textarea" ? (
              <textarea
                {...common}
                rows={4}
                placeholder={f.placeholder}
                className={cn(fieldBase, errorRing, "min-h-28 resize-y py-3.5 leading-relaxed")}
              />
            ) : f.kind === "select" ? (
              <div className="relative">
                <select {...common} className={cn(fieldBase, errorRing, "h-14 cursor-pointer appearance-none pr-11")}>
                  {f.options?.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  aria-hidden
                  className="pointer-events-none absolute right-4 top-1/2 size-5 -translate-y-1/2 text-muted"
                  strokeWidth={1.5}
                />
              </div>
            ) : (
              <input
                {...common}
                type={f.kind}
                inputMode={f.kind === "tel" ? "tel" : f.kind === "email" ? "email" : undefined}
                enterKeyHint="next"
                autoCapitalize={f.name === "name" || f.name === "city" ? "words" : f.kind === "email" ? "none" : undefined}
                spellCheck={f.kind === "tel" || f.kind === "email" ? false : undefined}
                autoComplete={f.autoComplete}
                placeholder={f.placeholder}
                className={cn(fieldBase, errorRing, "h-14")}
              />
            )}
            {f.hint && !err && (
              <p id={`${id}-hint`} className="mt-2 text-[0.8125rem] text-muted">
                {f.hint}
              </p>
            )}
            {err && (
              <p id={`${id}-error`} className="mt-2 flex items-center gap-1.5 text-[0.8125rem] font-medium text-danger">
                <AlertCircle aria-hidden className="size-4 shrink-0" strokeWidth={1.75} />
                {err}
              </p>
            )}
          </div>
        );
      })}

      {/* Honeypot — hidden from people and assistive tech. */}
      <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label>
          Сайт
          <input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" />
        </label>
      </div>

      {status === "error" && (
        <div
          ref={statusRef}
          id={`${formId}-status`}
          tabIndex={-1}
          role="alert"
          className="enter rounded-2xl border border-accent/25 bg-accent-soft p-4 text-[0.9375rem] outline-none sm:col-span-2"
        >
          <p className="flex items-center gap-2 font-semibold text-accent">
            <AlertCircle aria-hidden className="size-5" strokeWidth={1.75} />
            {t.form.errorTitle}
          </p>
          <p className="mt-1.5 text-ink/80">{errorMessage}</p>
          {(errorCode === "not_configured" || errorCode === "delivery_failed" || errorCode === "network") && (
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={whatsappLink(fallbackMessage(type, lastData))}
                target="_blank"
                rel="noopener noreferrer"
                className="press inline-flex h-11 items-center gap-2.5 rounded-full bg-ink pl-1.5 pr-4 text-sm font-medium text-white transition-colors duration-[var(--dur-press)] hover:bg-graphite-2"
              >
                <ChannelTile kind="whatsapp" className="size-8 rounded-full" />
                {channels.whatsapp.label}
                <span className="sr-only"> (откроется в новой вкладке)</span>
              </a>
              <ButtonLink href={channels.phone.url} variant="outline" size="sm" className="h-11">
                {channels.phone.value}
              </ButtonLink>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-col gap-4 pt-1 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="submit"
          variant="accent"
          size="lg"
          disabled={status === "submitting"}
          aria-busy={status === "submitting"}
          className="w-full sm:w-auto"
          arrow={status !== "submitting"}
        >
          {status === "submitting" && <Loader2 aria-hidden className="size-5 animate-spin" />}
          {status === "submitting" ? t.form.sending : submitLabel}
        </Button>
        <p className="text-[0.8125rem] leading-relaxed text-muted sm:max-w-xs sm:text-right">
          {t.form.consent}{" "}
          <Link href="/privacy" className="underline decoration-line underline-offset-4 hover:decoration-ink">
            {t.form.consentLink}
          </Link>
        </p>
      </div>
    </form>
  );
}
