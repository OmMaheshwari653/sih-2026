"use client";

import {
  CalendarClock,
  CircleCheckBig,
  Crosshair,
  FileUp,
  Hammer,
  MapPinned,
  RefreshCw,
  ScrollText,
  TriangleAlert,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input, Textarea } from "@/components/ui/Field";
import { DataRow, Panel } from "@/components/ui/Panel";
import { type Instrument, rupees } from "@/lib/data";

const reasons = [
  {
    id: "renewal",
    icon: RefreshCw,
    title: "Routine expiry renewal",
    body: "Validity has ended or is about to end. Standard re-stamping.",
    extra: null,
  },
  {
    id: "repair",
    icon: Hammer,
    title: "Post-repair / broken seal",
    body: "The instrument was opened or repaired, so the existing seal stands broken.",
    extra: "job-card",
  },
  {
    id: "appeal",
    icon: ScrollText,
    title: "Failed inspection — re-test",
    body: "Rectified after rejection and ready to be presented again.",
    extra: "rejection",
  },
  {
    id: "relocation",
    icon: MapPinned,
    title: "Device relocation",
    body: "Instrument moved to another branch or jurisdiction; geo-fence must be updated.",
    extra: "gps",
  },
] as const;

export const ReVerifyForm = ({ instrument }: { instrument: Instrument }) => {
  const [reason, setReason] = useState<(typeof reasons)[number]["id"]>(
    instrument.status === "rejected" ? "appeal" : "renewal",
  );
  const [tatkal, setTatkal] = useState(false);
  const [geo, setGeo] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const active = reasons.find((item) => item.id === reason) ?? reasons[0];
  const base = instrument.accuracyClass === "Class I" ? 1200 : 480;
  const late = instrument.status === "expired" ? 500 : 0;
  const priority = tatkal ? Math.round(base * 0.5) : 0;
  const total = base + late + priority;

  if (submitted) {
    return (
      <Panel>
        <div className="flex flex-col items-center py-8 text-center">
          <CircleCheckBig className="size-12 text-india-green" aria-hidden />
          <h2 className="mt-3 font-serif text-xl font-bold text-ink">
            Re-verification request raised
          </h2>
          <p className="num mt-1 text-sm font-semibold text-ink">
            APP2025001302 · {rupees(total)} paid
          </p>
          <p className="mt-3 max-w-lg text-[13px] leading-5 text-ink-muted">
            The request is tagged <strong>{active.title}</strong>. The officer
            will see your previous readings side-by-side during the re-test, and
            the old seal number will be logged as scrapped before a new QR seal
            is bound.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-gov bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
              href="/business/dashboard"
            >
              Back to dashboard
            </Link>
            <Link
              className="rounded-gov border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-alt"
              href="/lmo/inspections/INS-2025-4414/re-test"
            >
              See the officer&apos;s re-test screen
            </Link>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="space-y-4">
        <Panel
          action={<StatusBadge status={instrument.status} />}
          hint="Auto-loaded from the national register — verify before submitting."
          title="Device on record"
        >
          <dl className="grid gap-x-8 sm:grid-cols-2">
            <DataRow label="Instrument ID" mono value={instrument.id} />
            <DataRow label="Serial number" mono value={instrument.serial} />
            <DataRow
              label="Make / model"
              value={`${instrument.make} ${instrument.model}`}
            />
            <DataRow
              label="Class / capacity"
              value={`${instrument.accuracyClass} · ${instrument.capacity}`}
            />
            <DataRow
              label="Previous certificate"
              mono
              value={instrument.certificateId ?? "None on record"}
            />
            <DataRow
              label="Last calibrated"
              mono
              value={instrument.stampedOn}
            />
            <DataRow label="Valid till" mono value={instrument.validTill} />
            <DataRow label="Last verified by" value={instrument.officer} />
          </dl>
        </Panel>

        <Panel
          hint="What the officer needs to know before travelling"
          title="Reason for re-verification"
        >
          <div className="grid gap-2.5 sm:grid-cols-2">
            {reasons.map((item) => {
              const Icon = item.icon;
              const selected = reason === item.id;
              return (
                <button
                  className={`flex items-start gap-3 rounded-gov border p-3.5 text-left transition-colors ${
                    selected
                      ? "border-navy bg-navy/4"
                      : "border-line hover:border-navy/40"
                  }`}
                  key={item.id}
                  onClick={() => setReason(item.id)}
                  type="button"
                >
                  <Icon
                    className={`mt-0.5 size-4.5 shrink-0 ${selected ? "text-navy" : "text-ink-muted"}`}
                    aria-hidden
                  />
                  <span>
                    <span className="block text-[13px] font-semibold text-ink">
                      {item.title}
                    </span>
                    <span className="mt-0.5 block text-[11px] leading-4 text-ink-muted">
                      {item.body}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Reason-specific sub-flow */}
          <div className="mt-4 rounded-gov border border-dashed border-line bg-surface-alt p-4">
            {active.extra === "job-card" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  className="sm:col-span-2"
                  label="Repairer / mechanic name"
                  required
                >
                  <Input placeholder="e.g. Sharma Weighing Solutions" />
                </Field>
                <Field label="Job-card number" required>
                  <Input placeholder="e.g. JC/2025/4419" />
                </Field>
                <Field label="Date of repair" required>
                  <Input placeholder="DD/MM/YYYY" />
                </Field>
                <Field
                  className="sm:col-span-2"
                  label="Broken seal number"
                  required
                >
                  <Input placeholder="Seal number found on the instrument" />
                </Field>
                <Button className="sm:col-span-2" variant="secondary">
                  <FileUp className="size-4" aria-hidden />
                  Upload repairer job-card slip
                </Button>
              </div>
            ) : null}

            {active.extra === "rejection" ? (
              <div className="space-y-3">
                <div className="flex items-start gap-2.5 rounded-gov border border-red-200 bg-red-50 p-3">
                  <TriangleAlert
                    className="mt-0.5 size-4 shrink-0 text-red-700"
                    aria-hidden
                  />
                  <p className="text-[12px] leading-4.5 text-red-900">
                    Linked rejection <strong>INS-2025-4390</strong> — failed at
                    the 200 g test load with +0.9 g error against an MPE of ±0.5
                    g. Officer remark: &ldquo;Load cell drift; corner load test
                    also failed.&rdquo;
                  </p>
                </div>
                <Field label="Corrective action taken" required>
                  <Textarea placeholder="Describe the calibration or part replacement carried out." />
                </Field>
              </div>
            ) : null}

            {active.extra === "gps" ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field
                  className="sm:col-span-2"
                  label="New premises address"
                  required
                >
                  <Textarea
                    placeholder="Street, landmark, city, PIN"
                    rows={3}
                  />
                </Field>
                <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3 rounded-gov border border-line bg-surface p-3.5">
                  <p className="text-[12px] leading-4.5 text-ink-muted">
                    {geo
                      ? "New geo-fence pinned at 25.4501° N, 81.8210° E. The old fence is released on approval."
                      : "Capture the new GPS pin from the new location — jurisdiction may change."}
                  </p>
                  <Button
                    onClick={() => setGeo(true)}
                    size="sm"
                    variant={geo ? "success" : "secondary"}
                  >
                    <Crosshair className="size-3.5" aria-hidden />
                    {geo ? "Pin updated" : "Capture new pin"}
                  </Button>
                </div>
              </div>
            ) : null}

            {active.extra === null ? (
              <p className="text-[12px] leading-4.5 text-ink-muted">
                No additional documents needed for a routine renewal. Ensure the
                instrument is switched on, loaded to capacity if it is a
                platform scale, and that standard test weights can be placed
                beside it.
              </p>
            ) : null}
          </div>
        </Panel>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <Panel title="Queue & fee">
          <button
            className={`flex w-full items-start gap-3 rounded-gov border p-3 text-left transition-colors ${
              tatkal
                ? "border-amber-400 bg-amber-50"
                : "border-line hover:border-navy/40"
            }`}
            onClick={() => setTatkal((value) => !value)}
            type="button"
          >
            <Zap
              className={`mt-0.5 size-4 shrink-0 ${tatkal ? "text-amber-600" : "text-ink-muted"}`}
              aria-hidden
            />
            <span>
              <span className="block text-[12.5px] font-semibold text-ink">
                Tatkal / priority (+50%)
              </span>
              <span className="mt-0.5 block text-[11px] leading-4 text-ink-muted">
                Next working day. Standard queue is 7 working days.
              </span>
            </span>
          </button>

          <dl className="mt-3 space-y-1.5 text-xs">
            <div className="flex justify-between">
              <dt className="text-ink-muted">Re-stamping fee</dt>
              <dd className="num">{rupees(base)}</dd>
            </div>
            {late ? (
              <div className="flex justify-between text-red-700">
                <dt>Late fee (expired)</dt>
                <dd className="num">{rupees(late)}</dd>
              </div>
            ) : null}
            {priority ? (
              <div className="flex justify-between text-amber-700">
                <dt>Tatkal loading</dt>
                <dd className="num">{rupees(priority)}</dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-line-soft pt-2 text-sm font-bold text-ink">
              <dt>Total payable</dt>
              <dd className="num">{rupees(total)}</dd>
            </div>
          </dl>

          <p className="mt-3 flex items-start gap-1.5 text-[11px] leading-4 text-ink-muted">
            <CalendarClock className="mt-px size-3.5 shrink-0" aria-hidden />
            Expected inspection:{" "}
            {tatkal ? "21 May 2025 (next working day)" : "29 May 2025"}
          </p>

          <Button block className="mt-4" onClick={() => setSubmitted(true)}>
            Pay &amp; raise request
          </Button>
        </Panel>

        <Panel title="Why re-verification matters">
          <p className="text-[12px] leading-4.5 text-ink-muted">
            Under Rule 15 of the Legal Metrology (General) Rules, 2011, an
            instrument whose seal is broken — even by an authorised repairer —
            ceases to be a legal instrument until it is verified afresh. Trading
            on it in the interim is an offence.
          </p>
        </Panel>
      </aside>
    </div>
  );
};
