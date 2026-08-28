"use client";

import {
  BadgeIndianRupee,
  CalendarDays,
  CircleCheckBig,
  Landmark,
  Loader2,
  Smartphone,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { instruments, rupees } from "@/lib/data";

/** Fee slabs mirror the pattern of the state verification fee schedule. */
const baseFee: Record<string, number> = {
  "Class I": 1200,
  "Class II": 480,
  "Class III": 240,
  "Class IIII": 160,
};

const capacityLoading = (capacity: string) =>
  capacity.includes("500 kg") ? 900 : capacity.includes("50 kg") ? 60 : 0;

const slots = [
  {
    date: "22 May 2025",
    day: "Thursday",
    windows: ["09:30 – 11:00", "14:00 – 15:30"],
  },
  {
    date: "23 May 2025",
    day: "Friday",
    windows: ["10:00 – 11:30", "15:00 – 16:30"],
  },
  { date: "26 May 2025", day: "Monday", windows: ["09:00 – 10:30"] },
];

const methods = [
  {
    id: "upi",
    label: "UPI / BHIM",
    icon: Smartphone,
    note: "Instant · no charge",
  },
  {
    id: "netbanking",
    label: "Net banking",
    icon: Landmark,
    note: "Bharatkosh gateway",
  },
  {
    id: "card",
    label: "Debit / credit card",
    icon: BadgeIndianRupee,
    note: "MDR as applicable",
  },
];

export const SlotBooking = () => {
  const [picked, setPicked] = useState<string[]>([
    "LM-UP-PRY-000124",
    "LM-UP-PRY-000126",
  ]);
  const [tatkal, setTatkal] = useState(false);
  const [slot, setSlot] = useState("22 May 2025 · 09:30 – 11:00");
  const [method, setMethod] = useState("upi");
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);

  const selected = instruments.filter((item) => picked.includes(item.id));

  const bill = useMemo(() => {
    const lines = selected.map((item) => ({
      id: item.id,
      name: item.name,
      amount: baseFee[item.accuracyClass] + capacityLoading(item.capacity),
      late: item.status === "expired" ? 500 : 0,
    }));
    const base = lines.reduce((sum, line) => sum + line.amount, 0);
    const late = lines.reduce((sum, line) => sum + line.late, 0);
    const priority = tatkal ? Math.round(base * 0.5) : 0;
    const subtotal = base + late + priority;
    return { lines, base, late, priority, gst: 0, total: subtotal };
  }, [selected, tatkal]);

  if (paid) {
    return (
      <Panel>
        <div className="flex flex-col items-center py-8 text-center">
          <CircleCheckBig className="size-12 text-india-green" aria-hidden />
          <h2 className="mt-3 font-serif text-xl font-bold text-ink">
            Slot confirmed &amp; fee paid
          </h2>
          <p className="num mt-1 text-sm font-semibold text-ink">
            APP2025001301 · {rupees(bill.total)} · Receipt BK/2025/558210
          </p>
          <p className="mt-3 max-w-lg text-[13px] leading-5 text-ink-muted">
            {selected.length} instrument(s) are queued for {slot}. The assigned
            officer and route appear on your dashboard the previous evening.
            Keep the instruments accessible and switched on.
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
              href="/lmo/inspections/INS-2025-4413"
            >
              See the officer&apos;s view
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
          bodyClassName="divide-y divide-line-soft"
          hint="Only instruments needing verification are listed"
          title="1 · Select instruments"
        >
          {instruments
            .filter((item) => item.status !== "valid")
            .concat(instruments.filter((item) => item.status === "valid"))
            .map((item) => {
              const checked = picked.includes(item.id);
              return (
                <label
                  className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-surface-alt"
                  key={item.id}
                >
                  <input
                    checked={checked}
                    className="mt-1 size-4 accent-[#0b2b5c]"
                    onChange={() =>
                      setPicked((current) =>
                        current.includes(item.id)
                          ? current.filter((value) => value !== item.id)
                          : [...current, item.id],
                      )
                    }
                    type="checkbox"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="text-[13px] font-semibold text-ink">
                        {item.name}
                      </span>
                      <StatusBadge status={item.status} />
                    </span>
                    <span className="num mt-0.5 block text-[11px] text-ink-muted">
                      {item.id} · {item.accuracyClass} · {item.capacity} ·{" "}
                      {item.location}
                    </span>
                  </span>
                  <span className="num text-xs font-semibold text-ink">
                    {rupees(
                      baseFee[item.accuracyClass] +
                        capacityLoading(item.capacity),
                    )}
                  </span>
                </label>
              );
            })}
        </Panel>

        <Panel
          hint="Officers are allotted by circle; the exact arrival time is confirmed a day prior."
          title="2 · Choose an inspection window"
        >
          <button
            className={`mb-4 flex w-full items-start gap-3 rounded-gov border p-3.5 text-left transition-colors ${
              tatkal
                ? "border-amber-400 bg-amber-50"
                : "border-line hover:border-navy/40"
            }`}
            onClick={() => setTatkal((value) => !value)}
            type="button"
          >
            <Zap
              className={`mt-0.5 size-4.5 shrink-0 ${tatkal ? "text-amber-600" : "text-ink-muted"}`}
              aria-hidden
            />
            <span className="flex-1">
              <span className="block text-[13px] font-semibold text-ink">
                Tatkal / priority queue (+50% fee)
              </span>
              <span className="mt-0.5 block text-[11px] leading-4 text-ink-muted">
                Next-working-day inspection. Intended for fuel pumps, mandis and
                sealed instruments where trade has stopped.
              </span>
            </span>
            <span
              className={`mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border ${
                tatkal
                  ? "border-amber-500 bg-amber-500 text-white"
                  : "border-line"
              }`}
            >
              {tatkal ? (
                <CircleCheckBig className="size-3.5" aria-hidden />
              ) : null}
            </span>
          </button>

          <div className="grid gap-3 sm:grid-cols-3">
            {slots.map((day) => (
              <div
                className="rounded-gov border border-line p-3"
                key={day.date}
              >
                <p className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                  <CalendarDays className="size-3.5" aria-hidden />
                  {day.day}
                </p>
                <p className="num text-[13px] font-semibold text-ink">
                  {day.date}
                </p>
                <div className="mt-2 space-y-1.5">
                  {day.windows.map((window) => {
                    const id = `${day.date} · ${window}`;
                    return (
                      <button
                        className={`num w-full rounded-gov border px-2 py-1.5 text-[11px] font-medium transition-colors ${
                          slot === id
                            ? "border-navy bg-navy text-white"
                            : "border-line text-ink-muted hover:border-navy/40 hover:text-ink"
                        }`}
                        key={window}
                        onClick={() => setSlot(id)}
                        type="button"
                      >
                        {window}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Panel>

        <Panel title="3 · Payment method">
          <div className="grid gap-2.5 sm:grid-cols-3">
            {methods.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={`flex items-center gap-2.5 rounded-gov border p-3 text-left transition-colors ${
                    method === item.id
                      ? "border-navy bg-navy/4"
                      : "border-line hover:border-navy/40"
                  }`}
                  key={item.id}
                  onClick={() => setMethod(item.id)}
                  type="button"
                >
                  <Icon className="size-4.5 shrink-0 text-navy" aria-hidden />
                  <span>
                    <span className="block text-xs font-semibold text-ink">
                      {item.label}
                    </span>
                    <span className="block text-[10.5px] text-ink-muted">
                      {item.note}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-[11px] text-ink-muted">
            Fees are collected through the Government of India Bharatkosh
            gateway. A GST-compliant receipt is issued instantly.
          </p>
        </Panel>
      </div>

      {/* --------------------------------------------------------- Fee summary */}
      <aside className="xl:sticky xl:top-20 xl:self-start">
        <Panel title="Fee calculation">
          {bill.lines.length === 0 ? (
            <p className="py-4 text-center text-xs text-ink-muted">
              Select at least one instrument.
            </p>
          ) : (
            <>
              <ul className="space-y-2">
                {bill.lines.map((line) => (
                  <li
                    className="flex justify-between gap-3 text-xs"
                    key={line.id}
                  >
                    <span className="min-w-0 flex-1 text-ink-muted">
                      {line.name}
                      {line.late ? (
                        <span className="block text-[10.5px] text-red-700">
                          + late fee (expired instrument)
                        </span>
                      ) : null}
                    </span>
                    <span className="num font-semibold text-ink">
                      {rupees(line.amount + line.late)}
                    </span>
                  </li>
                ))}
              </ul>

              <dl className="mt-4 space-y-1.5 border-t border-line-soft pt-3 text-xs">
                <div className="flex justify-between">
                  <dt className="text-ink-muted">Verification fee</dt>
                  <dd className="num">{rupees(bill.base)}</dd>
                </div>
                {bill.late ? (
                  <div className="flex justify-between text-red-700">
                    <dt>Late application fee</dt>
                    <dd className="num">{rupees(bill.late)}</dd>
                  </div>
                ) : null}
                {bill.priority ? (
                  <div className="flex justify-between text-amber-700">
                    <dt>Tatkal loading (50%)</dt>
                    <dd className="num">{rupees(bill.priority)}</dd>
                  </div>
                ) : null}
                <div className="flex justify-between border-t border-line-soft pt-2 text-sm font-bold text-ink">
                  <dt>Total payable</dt>
                  <dd className="num">{rupees(bill.total)}</dd>
                </div>
              </dl>

              <div className="mt-3 rounded-gov bg-surface-alt p-3 text-[11px] leading-4 text-ink-muted">
                <p className="num font-semibold text-ink">{slot}</p>
                <p className="mt-0.5">
                  {selected.length} instrument(s) ·{" "}
                  {tatkal ? "Tatkal queue" : "Standard 7-day queue"}
                </p>
              </div>

              <Button
                block
                className="mt-4"
                disabled={paying}
                onClick={() => {
                  setPaying(true);
                  window.setTimeout(() => setPaid(true), 1100);
                }}
              >
                {paying ? (
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                ) : null}
                {paying ? "Contacting gateway…" : `Pay ${rupees(bill.total)}`}
              </Button>
            </>
          )}
        </Panel>
      </aside>
    </div>
  );
};
