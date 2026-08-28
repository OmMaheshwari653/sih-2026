"use client";

import {
  Camera,
  CircleCheckBig,
  Clock3,
  IndianRupee,
  ScanLine,
  Timer,
  Zap,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";

const recent = [
  {
    time: "10:41",
    vendor: "Sita Devi",
    type: "Counter scale 10 kg",
    id: "LM-UP-PRY-004881",
  },
  {
    time: "10:39",
    vendor: "Mohd. Irfan",
    type: "Spring balance 25 kg",
    id: "LM-UP-PRY-004880",
  },
  {
    time: "10:36",
    vendor: "Bablu Yadav",
    type: "Counter scale 10 kg",
    id: "LM-UP-PRY-004879",
  },
  {
    time: "10:33",
    vendor: "Kamla Prasad",
    type: "Beam scale 50 kg",
    id: "LM-UP-PRY-004878",
  },
];

/**
 * Single-screen flow for a vendor queue. Everything is on one card because the
 * officer is standing in a mandi with a phone, not seated at a desk.
 */
export const CampMode = () => {
  const [photo, setPhoto] = useState(false);
  const [seal, setSeal] = useState("");
  const [issued, setIssued] = useState(false);

  const reset = () => {
    setPhoto(false);
    setSeal("");
    setIssued(false);
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <Panel
        action={
          <Badge tone="amber">
            <Timer className="size-3" aria-hidden />
            Avg. 58 s per vendor
          </Badge>
        }
        title="New vendor — express stamping"
      >
        {issued ? (
          <div className="flex flex-col items-center py-8 text-center">
            <CircleCheckBig className="size-12 text-india-green" aria-hidden />
            <h2 className="mt-3 font-serif text-lg font-bold text-ink">
              Stamped &amp; sticker bound
            </h2>
            <p className="num mt-1 text-sm font-semibold text-ink">
              LM-UP-PRY-004882 · {seal || "QR-UP-2025-88420"} · ₹120 cash
              collected
            </p>
            <p className="mt-2 max-w-md text-[13px] leading-5 text-ink-muted">
              An SMS with the digital passport link has gone to the
              vendor&apos;s number. The record is already live for public QR
              scanning.
            </p>
            <Button className="mt-5" onClick={reset}>
              <Zap className="size-4" aria-hidden />
              Next vendor
            </Button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Vendor name" required>
                <Input placeholder="As spoken — no documents needed" />
              </Field>
              <Field
                hint="Digital passport link is sent here by SMS."
                label="Mobile number"
                required
              >
                <Input inputMode="numeric" placeholder="10-digit mobile" />
              </Field>
              <Field label="Instrument type" required>
                <Select defaultValue="Counter scale (10 kg)">
                  <option>Counter scale (10 kg)</option>
                  <option>Counter scale (30 kg)</option>
                  <option>Spring balance (25 kg)</option>
                  <option>Beam scale (50 kg)</option>
                  <option>Weights set (M1)</option>
                </Select>
              </Field>
              <Field label="Stall / pitch number">
                <Input placeholder="e.g. Stall 44" />
              </Field>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                className={`flex flex-col items-center justify-center gap-2 rounded-gov border border-dashed p-6 text-xs font-semibold transition-colors ${
                  photo
                    ? "border-india-green bg-emerald-50 text-emerald-800"
                    : "border-line text-ink-muted hover:border-navy hover:text-navy"
                }`}
                onClick={() => setPhoto(true)}
                type="button"
              >
                <Camera className="size-6" aria-hidden />
                {photo
                  ? "Photo captured — scale_004882.jpg"
                  : "Photograph the scale"}
              </button>

              <button
                className={`flex flex-col items-center justify-center gap-2 rounded-gov border border-dashed p-6 text-xs font-semibold transition-colors ${
                  seal
                    ? "border-india-green bg-emerald-50 text-emerald-800"
                    : "border-line text-ink-muted hover:border-navy hover:text-navy"
                }`}
                onClick={() => setSeal("QR-UP-2025-88420")}
                type="button"
              >
                <ScanLine className="size-6" aria-hidden />
                {seal ? `Sticker ${seal}` : "Scan QR sticker to bind"}
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-gov bg-surface-alt p-3.5">
              <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
                <IndianRupee className="size-4 text-navy" aria-hidden />
                Camp fee ₹120 · cash collected against receipt book
              </p>
              <Badge tone="green">Below ₹500 — no gateway needed</Badge>
            </div>

            <Button
              block
              className="mt-4"
              disabled={!photo || !seal}
              onClick={() => setIssued(true)}
              size="lg"
              variant="success"
            >
              <CircleCheckBig className="size-5" aria-hidden />
              Approve &amp; issue on the spot
            </Button>
          </>
        )}
      </Panel>

      <aside className="space-y-4">
        <Panel title="Camp progress">
          <div className="flex items-baseline justify-between">
            <p className="num text-3xl font-bold text-ink">62</p>
            <p className="num text-xs text-ink-muted">of 90 target</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line-soft">
            <div className="h-full w-[69%] rounded-full bg-india-green" />
          </div>
          <dl className="mt-4 grid grid-cols-2 gap-3 text-center">
            <div className="rounded-gov bg-surface-alt p-3">
              <dt className="text-[11px] text-ink-muted">Cash collected</dt>
              <dd className="num mt-0.5 text-sm font-bold text-ink">₹7,440</dd>
            </div>
            <div className="rounded-gov bg-surface-alt p-3">
              <dt className="flex items-center justify-center gap-1 text-[11px] text-ink-muted">
                <Clock3 className="size-3" aria-hidden /> Camp closes
              </dt>
              <dd className="num mt-0.5 text-sm font-bold text-ink">13:00</dd>
            </div>
          </dl>
        </Panel>

        <Panel
          bodyClassName="divide-y divide-line-soft"
          title="Stamped in this camp"
        >
          {recent.map((entry) => (
            <div className="flex items-start gap-3 px-4 py-2.5" key={entry.id}>
              <span className="num mt-0.5 text-[11px] text-ink-muted">
                {entry.time}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[12.5px] font-semibold text-ink">
                  {entry.vendor}
                </span>
                <span className="num block text-[11px] text-ink-muted">
                  {entry.type} · {entry.id}
                </span>
              </span>
            </div>
          ))}
        </Panel>
      </aside>
    </div>
  );
};
