"use client";

import {
  ArrowRight,
  CircleCheckBig,
  CircleX,
  Recycle,
  ScanLine,
  ShieldCheck,
  Unlock,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { type Inspection, instrumentById } from "@/lib/data";

const priorLoads = [
  { label: "10% of Max (22 g)", applied: 22, previous: 22.4, mpe: 0.11 },
  { label: "50% of Max (110 g)", applied: 110, previous: 110.6, mpe: 0.3 },
  { label: "100% of Max (220 g)", applied: 220, previous: 220.9, mpe: 0.5 },
];

export const ReTestWorkspace = ({ inspection }: { inspection: Inspection }) => {
  const instrument = instrumentById(inspection.instrumentId);

  const [current, setCurrent] = useState(["22.03", "110.12", "220.28"]);
  const [oldSeal, setOldSeal] = useState("");
  const [newSeal, setNewSeal] = useState("");
  const [cleared, setCleared] = useState(false);
  const [done, setDone] = useState(false);

  const rows = useMemo(
    () =>
      priorLoads.map((load, index) => {
        const now = Number(current[index]);
        const nowError = Number.isFinite(now) ? now - load.applied : 0;
        const priorError = load.previous - load.applied;
        return {
          ...load,
          now,
          nowError,
          priorError,
          priorPass: Math.abs(priorError) <= load.mpe,
          nowPass: Math.abs(nowError) <= load.mpe,
        };
      }),
    [current],
  );

  const allPass = rows.every((row) => row.nowPass);
  const ready = allPass && Boolean(oldSeal) && Boolean(newSeal) && cleared;

  if (done) {
    return (
      <Panel>
        <div className="flex flex-col items-center py-8 text-center">
          <CircleCheckBig className="size-12 text-india-green" aria-hidden />
          <h2 className="mt-3 font-serif text-xl font-bold text-ink">
            Re-test cleared
          </h2>
          <p className="num mt-1 text-sm font-semibold text-ink">
            LMC/UP/2025/0090488 · Seal {newSeal || "QR-UP-2025-77121"}
          </p>
          <p className="mt-3 max-w-lg text-[13px] leading-5 text-ink-muted">
            The red-flag on the trader&apos;s account has been lifted, the
            scrapped seal is logged against the audit trail, and the public
            record now reads <strong>Certified &amp; Active</strong>.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <Link
              className="rounded-gov bg-navy px-4 py-2.5 text-sm font-semibold text-white hover:bg-navy-700"
              href="/lmo/dashboard"
            >
              Next inspection
            </Link>
            <Link
              className="rounded-gov border border-line px-4 py-2.5 text-sm font-semibold text-ink hover:bg-surface-alt"
              href="/lmo/history"
            >
              View audit log
            </Link>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="space-y-4">
        <div className="flex flex-wrap items-start gap-3 rounded-gov border-l-4 border-l-red-600 border-y border-r border-line bg-red-50/60 p-4">
          <CircleX
            className="mt-0.5 size-5 shrink-0 text-red-700"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-red-900">
              Previously rejected — INS-2025-4390 on 02 Feb 2025
            </h2>
            <p className="mt-0.5 text-[12.5px] leading-4.5 text-red-900/85">
              Officer remark: &ldquo;Failed at 200 g test load with +0.9 g error
              against an MPE of ±0.5 g. Load cell drift suspected; corner load
              test also failed.&rdquo; Trader filed a re-test appeal citing load
              cell replacement.
            </p>
          </div>
          <Badge tone="red">Trade locked</Badge>
        </div>

        {/* ---------------------------------------------- Delta comparison */}
        <Panel
          hint="Previous failed readings against today's live readings"
          title="Delta comparison"
        >
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-3xl border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-line bg-surface-alt text-[10.5px] uppercase tracking-wide text-ink-muted">
                  <th className="px-3 py-2.5 font-semibold">Test load</th>
                  <th className="px-3 py-2.5 font-semibold">
                    Previous reading
                  </th>
                  <th className="px-3 py-2.5 font-semibold">Previous error</th>
                  <th className="px-3 py-2.5 font-semibold">
                    Today&apos;s reading
                  </th>
                  <th className="px-3 py-2.5 font-semibold">Error now</th>
                  <th className="px-3 py-2.5 font-semibold">MPE</th>
                  <th className="px-3 py-2.5 font-semibold">Verdict</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line-soft">
                {rows.map((row, index) => (
                  <tr key={row.label}>
                    <td className="px-3 py-2.5 font-medium text-ink">
                      {row.label}
                    </td>
                    <td className="num px-3 py-2.5 text-ink-muted">
                      {row.previous.toFixed(2)} g
                    </td>
                    <td className="num px-3 py-2.5 font-semibold text-red-700">
                      +{row.priorError.toFixed(2)} g
                    </td>
                    <td className="px-3 py-2">
                      <Input
                        className="num w-28 px-2 py-1.5 text-xs"
                        inputMode="decimal"
                        onChange={(event) =>
                          setCurrent((values) =>
                            values.map((value, position) =>
                              position === index ? event.target.value : value,
                            ),
                          )
                        }
                        value={current[index]}
                      />
                    </td>
                    <td
                      className={`num px-3 py-2.5 font-semibold ${row.nowPass ? "text-emerald-700" : "text-red-700"}`}
                    >
                      {row.nowError > 0 ? "+" : ""}
                      {row.nowError.toFixed(2)} g
                    </td>
                    <td className="num px-3 py-2.5 text-ink-muted">
                      ± {row.mpe} g
                    </td>
                    <td className="px-3 py-2.5">
                      <span className="flex items-center gap-1.5">
                        <Badge tone="red">Fail</Badge>
                        <ArrowRight
                          className="size-3 text-ink-muted"
                          aria-hidden
                        />
                        <Badge tone={row.nowPass ? "green" : "red"}>
                          {row.nowPass ? "Pass" : "Fail"}
                        </Badge>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-3 text-[11.5px] text-ink-muted">
            Instrument: {instrument.name} · {instrument.id} ·{" "}
            {instrument.accuracyClass} · {instrument.capacity}
          </p>
        </Panel>

        {/* --------------------------------------------- Seal replacement */}
        <Panel
          hint="The scrapped seal number must be logged before a new one is bound."
          title="Seal replacement log"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">
                Old / broken seal number
              </p>
              <div className="flex items-center gap-2 rounded-gov border border-line px-3">
                <Recycle
                  className="size-4 shrink-0 text-ink-muted"
                  aria-hidden
                />
                <input
                  className="num w-full bg-transparent py-2.5 text-xs outline-none placeholder:text-ink-muted/70"
                  onChange={(event) => setOldSeal(event.target.value)}
                  placeholder="QR-UP-2024-41220"
                  value={oldSeal}
                />
              </div>
              <button
                className="mt-1.5 text-[11px] font-semibold text-navy-500 hover:underline"
                onClick={() => setOldSeal("QR-UP-2024-41220")}
                type="button"
              >
                Read from previous record
              </button>
            </div>

            <div>
              <p className="mb-1.5 text-xs font-semibold text-ink">
                New tamper-proof seal
              </p>
              <div className="flex items-center gap-2 rounded-gov border border-line px-3">
                <ScanLine
                  className="size-4 shrink-0 text-ink-muted"
                  aria-hidden
                />
                <input
                  className="num w-full bg-transparent py-2.5 text-xs outline-none placeholder:text-ink-muted/70"
                  onChange={(event) => setNewSeal(event.target.value)}
                  placeholder="QR-UP-2025-XXXXX"
                  value={newSeal}
                />
              </div>
              <button
                className="mt-1.5 text-[11px] font-semibold text-navy-500 hover:underline"
                onClick={() => setNewSeal("QR-UP-2025-77121")}
                type="button"
              >
                Scan with camera
              </button>
            </div>
          </div>

          <p className="mt-3 rounded-gov bg-surface-alt p-3 text-[11.5px] leading-4 text-ink-muted">
            Scrapped seals are reconciled against the district stock register
            every month. A seal reported broken but never surrendered raises an
            automatic flag on the officer&apos;s account.
          </p>
        </Panel>
      </div>

      <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <Panel title="Rejection clearance">
          <label className="flex cursor-pointer items-start gap-2.5 rounded-gov border border-line p-3">
            <input
              checked={cleared}
              className="mt-0.5 size-4 shrink-0 accent-[#0b2b5c]"
              disabled={!allPass}
              onChange={(event) => setCleared(event.target.checked)}
              type="checkbox"
            />
            <span>
              <span className="flex items-center gap-1.5 text-[12.5px] font-semibold text-ink">
                <Unlock className="size-3.5" aria-hidden />
                Lift the &ldquo;Scale locked / red flag&rdquo; status
              </span>
              <span className="mt-0.5 block text-[11px] leading-4 text-ink-muted">
                Removes the public rejection notice from the trader&apos;s
                account and from consumer QR scans.
              </span>
            </span>
          </label>

          <ul className="mt-3 space-y-1.5 text-[11.5px] text-ink-muted">
            {[
              [allPass, "All test loads within MPE"],
              [Boolean(oldSeal), "Old seal number logged"],
              [Boolean(newSeal), "New seal scanned"],
              [cleared, "Clearance toggle set"],
            ].map(([ok, label]) => (
              <li className="flex items-center gap-1.5" key={String(label)}>
                {ok ? (
                  <CircleCheckBig
                    className="size-3.5 text-india-green"
                    aria-hidden
                  />
                ) : (
                  <CircleX className="size-3.5 text-amber-600" aria-hidden />
                )}
                {label}
              </li>
            ))}
          </ul>

          <Button
            block
            className="mt-4"
            disabled={!ready}
            onClick={() => setDone(true)}
            variant="success"
          >
            <ShieldCheck className="size-4" aria-hidden />
            Clear &amp; issue certificate
          </Button>

          <Button
            block
            className="mt-2"
            onClick={() => setDone(false)}
            variant="danger"
          >
            <CircleX className="size-4" aria-hidden />
            Reject again
          </Button>
        </Panel>
      </aside>
    </div>
  );
};
