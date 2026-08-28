"use client";

import {
  CircleCheckBig,
  Crosshair,
  FileUp,
  Loader2,
  MapPin,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select, Textarea } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { Stepper } from "@/components/ui/Stepper";

const steps = ["Instrument details", "Deployment location", "Documents"];

const docs = [
  {
    label: "Manufacturer invoice",
    hint: "Purchase invoice showing make, model and serial number.",
    required: true,
  },
  {
    label: "Model approval certificate",
    hint: "Approval issued by the Regional Reference Standards Laboratory.",
    required: true,
  },
  {
    label: "Initial test report",
    hint: "Manufacturer or dealer calibration report, if available.",
    required: false,
  },
];

export const RegisterWizard = () => {
  const [step, setStep] = useState(0);
  const [geo, setGeo] = useState<"idle" | "locating" | "done">("idle");
  const [uploaded, setUploaded] = useState<string[]>([]);
  const [done, setDone] = useState(false);

  if (done) {
    return (
      <Panel>
        <div className="flex flex-col items-center py-8 text-center">
          <CircleCheckBig className="size-12 text-india-green" aria-hidden />
          <h2 className="mt-3 font-serif text-xl font-bold text-ink">
            Instrument registered
          </h2>
          <p className="num mt-1 text-sm font-semibold text-ink">
            LM-UP-PRY-000129
          </p>
          <p className="mt-3 max-w-md text-[13px] leading-5 text-ink-muted">
            The device is now on your fleet with status{" "}
            <strong>Unverified</strong>. It cannot legally be used for trade
            until an officer stamps it. Book a verification slot to proceed.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-gov bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
              href="/business/requests/new"
            >
              Book verification slot
            </Link>
            <Link
              className="rounded-gov border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-alt"
              href="/business/instruments"
            >
              Back to fleet
            </Link>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <>
      <Stepper current={step} steps={steps} />

      <Panel>
        {step === 0 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Instrument category" required>
              <Select defaultValue="Weighing instrument">
                <option>Weighing instrument</option>
                <option>Measuring instrument</option>
                <option>Dispensing unit</option>
                <option>Weights & test measures</option>
              </Select>
            </Field>
            <Field label="Instrument type" required>
              <Select defaultValue="Bench scale">
                <option>Bench scale</option>
                <option>Platform scale</option>
                <option>Counter machine</option>
                <option>Precision balance</option>
                <option>Fuel dispensing nozzle</option>
                <option>Weighbridge</option>
              </Select>
            </Field>
            <Field label="Make / manufacturer" required>
              <Input placeholder="e.g. Essae Digitronics" />
            </Field>
            <Field label="Model number" required>
              <Input placeholder="e.g. DS-415N" />
            </Field>
            <Field
              hint="Must match the plate riveted on the instrument body."
              label="Serial number"
              required
            >
              <Input placeholder="e.g. ESSAE-DS-45219" />
            </Field>
            <Field
              hint="Class III covers ordinary retail trade; Class II is for precious metals."
              label="Accuracy class"
              required
            >
              <Select defaultValue="Class III">
                <option>Class I</option>
                <option>Class II</option>
                <option>Class III</option>
                <option>Class IIII</option>
              </Select>
            </Field>
            <Field label="Maximum capacity" required>
              <Input placeholder="e.g. 30 kg" />
            </Field>
            <Field
              hint="The scale interval 'e' printed on the instrument."
              label="Verification interval (e)"
              required
            >
              <Input placeholder="e.g. 10 g" />
            </Field>
            <Field label="Year of manufacture">
              <Input inputMode="numeric" placeholder="e.g. 2025" />
            </Field>
            <Field label="Model approval number">
              <Input placeholder="e.g. RRSL/AP/2024/1188" />
            </Field>
          </div>
        ) : null}

        {step === 1 ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Branch / premises name" required>
              <Select defaultValue="Civil Lines — Main Store">
                <option>Civil Lines — Main Store</option>
                <option>Mundera Mandi — Godown</option>
                <option>Katra — Dairy Booth</option>
                <option>+ Add a new premises</option>
              </Select>
            </Field>
            <Field label="Placement inside premises" required>
              <Input placeholder="e.g. Billing counter 2" />
            </Field>
            <Field className="sm:col-span-2" label="Full address" required>
              <Textarea
                defaultValue={
                  "12/4 Civil Lines, Prayagraj, Uttar Pradesh — 211001"
                }
                rows={3}
              />
            </Field>

            <div className="sm:col-span-2">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-gov border border-line bg-surface-alt p-4">
                <div className="flex items-start gap-2.5">
                  <MapPin
                    className="mt-0.5 size-4.5 shrink-0 text-navy"
                    aria-hidden
                  />
                  <div>
                    <p className="text-xs font-semibold text-ink">
                      Geo-pin for the geo-fence
                    </p>
                    <p className="mt-0.5 max-w-lg text-[11px] leading-4 text-ink-muted">
                      {geo === "done"
                        ? "Pinned at 25.4358° N, 81.8463° E (±6 m). The officer's Verify button will unlock only within 50 m of this point."
                        : "Stand at the instrument and capture the pin. This is what locks fake desk-issued stamping."}
                    </p>
                  </div>
                </div>
                <Button
                  disabled={geo === "locating"}
                  onClick={() => {
                    setGeo("locating");
                    window.setTimeout(() => setGeo("done"), 900);
                  }}
                  size="sm"
                  variant={geo === "done" ? "success" : "secondary"}
                >
                  {geo === "locating" ? (
                    <Loader2 className="size-3.5 animate-spin" aria-hidden />
                  ) : (
                    <Crosshair className="size-3.5" aria-hidden />
                  )}
                  {geo === "done" ? "Pin captured" : "Capture GPS pin"}
                </Button>
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div className="space-y-3">
            {docs.map((doc) => {
              const isUploaded = uploaded.includes(doc.label);
              return (
                <div
                  className="flex flex-wrap items-center justify-between gap-3 rounded-gov border border-line p-4"
                  key={doc.label}
                >
                  <div>
                    <p className="text-[13px] font-semibold text-ink">
                      {doc.label}
                      {doc.required ? (
                        <span className="ml-1 text-red-600">*</span>
                      ) : (
                        <span className="ml-1.5 text-[11px] font-normal text-ink-muted">
                          (optional)
                        </span>
                      )}
                    </p>
                    <p className="mt-0.5 text-[11px] text-ink-muted">
                      {isUploaded
                        ? "invoice_scan.pdf · 412 KB · uploaded"
                        : doc.hint}
                    </p>
                  </div>
                  <Button
                    onClick={() =>
                      setUploaded((current) =>
                        current.includes(doc.label)
                          ? current.filter((item) => item !== doc.label)
                          : [...current, doc.label],
                      )
                    }
                    size="sm"
                    variant={isUploaded ? "success" : "secondary"}
                  >
                    {isUploaded ? (
                      <CircleCheckBig className="size-3.5" aria-hidden />
                    ) : (
                      <FileUp className="size-3.5" aria-hidden />
                    )}
                    {isUploaded ? "Uploaded" : "Upload PDF / JPG"}
                  </Button>
                </div>
              );
            })}

            <label className="flex items-start gap-2.5 rounded-gov bg-surface-alt p-3.5 text-[12px] leading-4.5 text-ink-muted">
              <input
                className="mt-0.5 size-3.5 accent-[#0b2b5c]"
                type="checkbox"
              />
              I declare that the particulars furnished are true, and that this
              instrument will not be used for trade until it is verified and
              stamped under the Legal Metrology Act, 2009.
            </label>
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
              Save &amp; continue
            </Button>
          ) : (
            <Button onClick={() => setDone(true)}>Submit registration</Button>
          )}
        </div>
      </Panel>
    </>
  );
};
