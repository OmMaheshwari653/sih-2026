"use client";

import {
  Camera,
  Check,
  CircleCheckBig,
  Crosshair,
  EyeOff,
  ImagePlus,
  Loader2,
  ShieldQuestion,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Chip, Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";

const steps = ["Which shop?", "What went wrong?", "Evidence & submit"];

const issues = [
  "Scale manipulated / under-weighing",
  "Seal broken or missing",
  "Refused to show certificate",
  "Charging on gross weight",
  "Expired stamping still in use",
  "Tampered fuel dispenser",
];

export const ReportWizard = () => {
  const scaleId = useSearchParams().get("scale") ?? "";

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [anonymous, setAnonymous] = useState(true);
  const [geo, setGeo] = useState<"idle" | "locating" | "done">("idle");
  const [files, setFiles] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const toggleIssue = (issue: string) =>
    setSelected((current) =>
      current.includes(issue)
        ? current.filter((item) => item !== issue)
        : [...current, issue],
    );

  const captureGeo = () => {
    setGeo("locating");
    window.setTimeout(() => setGeo("done"), 900);
  };

  if (submitted) {
    return (
      <Panel>
        <div className="flex flex-col items-center py-6 text-center">
          <CircleCheckBig className="size-12 text-india-green" aria-hidden />
          <h2 className="mt-3 font-serif text-xl font-bold text-ink">
            Complaint registered
          </h2>
          <p className="num mt-1 text-sm font-semibold text-ink">
            Reference No. FR-2025-08842
          </p>
          <p className="mt-3 max-w-md text-[13px] leading-5 text-ink-muted">
            The report has reached the district Legal Metrology Officer&apos;s
            triage queue. A surprise inspection decision is recorded within 48
            hours, and you can track the status with this reference number.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-gov bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
              href="/"
            >
              Back to home
            </Link>
            <Link
              className="rounded-gov border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-alt"
              href="/admin/fraud-reports"
            >
              See how officers triage it
            </Link>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <>
      {/* Stepper */}
      <ol className="mb-4 flex overflow-hidden rounded-gov border border-line bg-surface">
        {steps.map((label, index) => {
          const done = index < step;
          const active = index === step;
          return (
            <li
              className={`flex flex-1 items-center gap-2 border-r border-line px-3 py-2.5 last:border-r-0 ${
                active ? "bg-navy/5" : ""
              }`}
              key={label}
            >
              <span
                className={`num flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                  done
                    ? "bg-india-green text-white"
                    : active
                      ? "bg-navy text-white"
                      : "bg-surface-alt text-ink-muted"
                }`}
              >
                {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
              </span>
              <span
                className={`text-[11px] leading-4 sm:text-xs ${
                  active ? "font-semibold text-ink" : "text-ink-muted"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>

      <Panel>
        {step === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              className="sm:col-span-2"
              hint={
                scaleId
                  ? "Auto-filled from the QR sticker you scanned."
                  : "Leave blank if the scale has no sticker."
              }
              label="Instrument / QR ID"
            >
              <Input defaultValue={scaleId} placeholder="LM-UP-PRY-000123" />
            </Field>
            <Field label="Shop or business name" required>
              <Input placeholder="e.g. Sunrise Kirana Store" />
            </Field>
            <Field label="Market / locality" required>
              <Input placeholder="e.g. Govind Nagar" />
            </Field>
            <Field className="sm:col-span-2" label="Full address">
              <Textarea
                placeholder="Street, landmark, city, PIN code"
                rows={3}
              />
            </Field>
            <Field label="District" required>
              <Select defaultValue="Prayagraj">
                <option>Prayagraj</option>
                <option>Lucknow</option>
                <option>Kanpur Nagar</option>
                <option>Varanasi</option>
                <option>Gorakhpur</option>
              </Select>
            </Field>
            <Field label="Type of establishment">
              <Select defaultValue="Retail kirana">
                <option>Retail kirana</option>
                <option>Fuel station</option>
                <option>Jeweller</option>
                <option>Mandi / wholesale stall</option>
                <option>Dairy booth</option>
              </Select>
            </Field>
          </div>
        ) : null}

        {step === 1 ? (
          <div>
            <p className="mb-2.5 text-xs font-semibold text-ink">
              Select everything that applies
            </p>
            <div className="flex flex-wrap gap-2">
              {issues.map((issue) => (
                <Chip
                  active={selected.includes(issue)}
                  key={issue}
                  onClick={() => toggleIssue(issue)}
                >
                  {issue}
                </Chip>
              ))}
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <Field label="Goods you purchased">
                <Input placeholder="e.g. 2 kg sugar" />
              </Field>
              <Field label="Shortfall you suspect">
                <Input placeholder="e.g. approx. 150 g less" />
              </Field>
              <Field className="sm:col-span-2" label="What happened?">
                <Textarea placeholder="Describe briefly — the officer reads this before deciding on a raid." />
              </Field>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="grid gap-4">
            <div>
              <p className="mb-2 text-xs font-semibold text-ink">
                Photo evidence
              </p>
              <div className="flex flex-wrap gap-3">
                {files.map((file) => (
                  <div
                    className="flex size-24 flex-col items-center justify-center rounded-gov border border-line bg-surface-alt text-[10px] text-ink-muted"
                    key={file}
                  >
                    <ImagePlus className="size-5" aria-hidden />
                    <span className="mt-1">{file}</span>
                  </div>
                ))}
                <button
                  className="flex size-24 flex-col items-center justify-center rounded-gov border border-dashed border-line text-[11px] font-medium text-ink-muted hover:border-navy hover:text-navy"
                  onClick={() =>
                    setFiles((current) => [
                      ...current,
                      `IMG_${1204 + current.length}.jpg`,
                    ])
                  }
                  type="button"
                >
                  <Camera className="size-5" aria-hidden />
                  <span className="mt-1">Add photo</span>
                </button>
              </div>
              <p className="mt-1.5 text-[11px] text-ink-muted">
                Photograph the scale display, the seal and the bill if
                available.
              </p>
            </div>

            <div className="rounded-gov border border-line bg-surface-alt p-3.5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-ink">
                    Live location tag
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    {geo === "done"
                      ? "Captured — 25.4358° N, 81.8463° E (±8 m)"
                      : "Needed so the report is routed to the correct jurisdiction."}
                  </p>
                </div>
                <Button
                  disabled={geo === "locating"}
                  onClick={captureGeo}
                  size="sm"
                  variant={geo === "done" ? "success" : "secondary"}
                >
                  {geo === "locating" ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  ) : (
                    <Crosshair className="size-3.5" aria-hidden />
                  )}
                  {geo === "done" ? "Location tagged" : "Capture location"}
                </Button>
              </div>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-gov border border-line p-3.5">
              <input
                checked={anonymous}
                className="mt-0.5 size-4 accent-[#0b2b5c]"
                onChange={(event) => setAnonymous(event.target.checked)}
                type="checkbox"
              />
              <span>
                <span className="flex items-center gap-1.5 text-xs font-semibold text-ink">
                  <EyeOff className="size-3.5" aria-hidden />
                  File this report anonymously
                </span>
                <span className="mt-0.5 block text-[11px] text-ink-muted">
                  Your name and number stay with the department for follow-up
                  but are withheld from the trader and from any inspection
                  record.
                </span>
              </span>
            </label>

            {!anonymous ? (
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Your name" required>
                  <Input placeholder="Full name" />
                </Field>
                <Field label="Mobile number" required>
                  <Input inputMode="numeric" placeholder="10-digit mobile" />
                </Field>
              </div>
            ) : null}

            <p className="flex items-start gap-2 rounded-gov bg-amber-50 p-3 text-[11px] leading-4 text-amber-900">
              <ShieldQuestion className="mt-px size-4 shrink-0" aria-hidden />
              Knowingly filing a false complaint is punishable. Reports found
              malicious after inspection are closed and flagged.
            </p>
          </div>
        ) : null}

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line-soft pt-4">
          <Button
            disabled={step === 0}
            onClick={() => setStep((value) => value - 1)}
            variant="secondary"
          >
            Back
          </Button>
          <p className="text-[11px] text-ink-muted">
            Step {step + 1} of {steps.length}
          </p>
          {step < steps.length - 1 ? (
            <Button onClick={() => setStep((value) => value + 1)}>
              Continue
            </Button>
          ) : (
            <Button onClick={() => setSubmitted(true)} variant="danger">
              Submit complaint
            </Button>
          )}
        </div>
      </Panel>
    </>
  );
};
