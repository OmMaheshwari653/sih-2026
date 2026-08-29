"use client";

import {
  CircleCheckBig,
  CircleX,
  Loader2,
  Lock,
  LockOpen,
  MapPinned,
  QrCode,
  Ruler,
  ScanLine,
  Stamp,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Field";
import { DataRow, Panel } from "@/components/ui/Panel";
import { type Inspection, instrumentById } from "@/lib/data";

/** Test loads and the permissible error the Act allows at each, in grams. */
const testLoads = [
  { label: "10% of Max", applied: 3000, mpe: 5 },
  { label: "50% of Max", applied: 15000, mpe: 10 },
  { label: "100% of Max", applied: 30000, mpe: 15 },
];

const checklist = [
  "Verification plate and previous seal intact and legible",
  "Instrument level, corner-load test satisfactory",
  "Zero-setting and tare functioning within one interval",
  "Display readable to the customer from the counter side",
  "No unauthorised remote or concealed switch found",
];

export const InspectionWorkspace = ({
  inspection,
}: {
  inspection: Inspection;
}) => {
  const instrument = instrumentById(inspection.instrumentId);

  const [geo, setGeo] = useState<"idle" | "locating" | "inside">("idle");
  const [readings, setReadings] = useState<string[]>([
    "3005",
    "15008",
    "30022",
  ]);
  const [checked, setChecked] = useState<string[]>(checklist.slice(0, 3));
  const [seal, setSeal] = useState("");
  const [issued, setIssued] = useState<"none" | "passed" | "rejected">("none");

  const locked = geo !== "inside";

  const rows = useMemo(
    () =>
      testLoads.map((load, index) => {
        const observed = Number(readings[index]);
        const error = Number.isFinite(observed) ? observed - load.applied : 0;
        return {
          ...load,
          observed,
          error,
          pass: Math.abs(error) <= load.mpe,
        };
      }),
    [readings],
  );

  const autoVerdict = rows.every((row) => row.pass);

  if (issued !== "none") {
    const passed = issued === "passed";
    return (
      <Panel>
        <div className="flex flex-col items-center py-8 text-center">
          {passed ? (
            <CircleCheckBig className="size-12 text-india-green" aria-hidden />
          ) : (
            <CircleX className="size-12 text-red-700" aria-hidden />
          )}
          <h2 className="mt-3 font-serif text-xl font-bold text-ink">
            {passed ? "Verified — certificate issued" : "Instrument rejected"}
          </h2>
          <p className="num mt-1 text-sm font-semibold text-ink">
            {passed
              ? "LMC/UP/2025/0090412 · Seal QR-UP-2025-77120"
              : `Rejection ${inspection.id}-R · Trader notified`}
          </p>
          <p className="mt-3 max-w-lg text-[13px] leading-5 text-ink-muted">
            {passed
              ? "The digital seal is bound to this instrument and is live for public scanning. The trader can print the hologram sticker from their vault immediately."
              : "The instrument is locked for trade use and shows as rejected to any consumer scanning it. The trader may apply for a re-test after rectification."}
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
              href={`/verify/${instrument.id}`}
            >
              View public record
            </Link>
          </div>
        </div>
      </Panel>
    );
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_21rem]">
      <div className="space-y-4">
        {/* ------------------------------------------------ Geo-fence gate */}
        <section
          className={`rounded-gov border p-4 ${
            locked
              ? "border-amber-300 bg-amber-50"
              : "border-emerald-300 bg-emerald-50"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              {locked ? (
                <Lock
                  className="mt-0.5 size-5 shrink-0 text-amber-700"
                  aria-hidden
                />
              ) : (
                <LockOpen
                  className="mt-0.5 size-5 shrink-0 text-emerald-700"
                  aria-hidden
                />
              )}
              <div>
                <h2
                  className={`text-sm font-semibold ${locked ? "text-amber-900" : "text-emerald-900"}`}
                >
                  {locked
                    ? "Geo-fence locked — verification disabled"
                    : "Geo-fence satisfied — verification unlocked"}
                </h2>
                <p
                  className={`mt-0.5 max-w-xl text-[12px] leading-4.5 ${locked ? "text-amber-900/80" : "text-emerald-900/80"}`}
                >
                  {geo === "idle"
                    ? "Your device is 2.4 km from the registered premises. Stand at the instrument and acquire your location; the Verify action stays disabled beyond 50 m."
                    : geo === "locating"
                      ? "Acquiring GPS fix and comparing against the premises pin…"
                      : "Device at 25.4359° N, 81.8461° E — 11 m from the registered pin (±6 m accuracy). This match is written into the certificate hash."}
                </p>
              </div>
            </div>

            <Button
              disabled={geo === "locating"}
              onClick={() => {
                setGeo("locating");
                window.setTimeout(() => setGeo("inside"), 1200);
              }}
              size="sm"
              variant={locked ? "primary" : "success"}
            >
              {geo === "locating" ? (
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
              ) : (
                <MapPinned className="size-3.5" aria-hidden />
              )}
              {geo === "inside" ? "Location matched" : "Acquire location"}
            </Button>
          </div>
        </section>

        <Panel
          action={<Badge tone="navy">{inspection.kind}</Badge>}
          title="Instrument presented"
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
            <DataRow label="Premises" value={inspection.address} />
            <DataRow label="Slot" mono value={inspection.slot} />
          </dl>
        </Panel>

        {/* ------------------------------------------------- Calibration */}
        <Panel
          hint="Enter the displayed reading against each standard test load."
          title="Tolerance calibration"
        >
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-2xl border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-line bg-surface-alt text-[10.5px] uppercase tracking-wide text-ink-muted">
                  <th className="px-3 py-2.5 font-semibold">Test load</th>
                  <th className="px-3 py-2.5 font-semibold">
                    Standard applied (g)
                  </th>
                  <th className="px-3 py-2.5 font-semibold">
                    Observed reading (g)
                  </th>
                  <th className="px-3 py-2.5 font-semibold">Error (g)</th>
                  <th className="px-3 py-2.5 font-semibold">MPE</th>
                  <th className="px-3 py-2.5 font-semibold">Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr className="border-b border-line-soft" key={row.label}>
                    <td className="px-3 py-2.5 font-medium text-ink">
                      {row.label}
                    </td>
                    <td className="num px-3 py-2.5 text-ink-muted">
                      {row.applied.toLocaleString("en-IN")}
                    </td>
                    <td className="px-3 py-2.5">
                      <input
                        className="num w-24 rounded-gov border border-line px-2 py-1.5 text-xs outline-none focus:border-navy-500 disabled:opacity-60"
                        disabled={locked}
                        onChange={(event) =>
                          setReadings((current) =>
                            current.map((value, i) =>
                              i === index ? event.target.value : value,
                            ),
                          )
                        }
                        value={readings[index]}
                      />
                    </td>
                    <td
                      className={`num px-3 py-2.5 font-semibold ${row.pass ? "text-emerald-700" : "text-red-700"}`}
                    >
                      {row.error > 0 ? "+" : ""}
                      {row.error}
                    </td>
                    <td className="num px-3 py-2.5 text-ink-muted">
                      ± {row.mpe}
                    </td>
                    <td className="px-3 py-2.5">
                      <Badge tone={row.pass ? "green" : "red"}>
                        {row.pass ? "Within MPE" : "Beyond MPE"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div
            className={`mt-4 flex flex-wrap items-center gap-3 rounded-gov border p-3.5 ${
              autoVerdict
                ? "border-emerald-300 bg-emerald-50"
                : "border-red-300 bg-red-50"
            }`}
          >
            <Ruler
              className={`size-5 shrink-0 ${autoVerdict ? "text-emerald-700" : "text-red-700"}`}
              aria-hidden
            />
            <p
              className={`flex-1 text-[12.5px] leading-4.5 ${autoVerdict ? "text-emerald-900" : "text-red-900"}`}
            >
              <strong>
                System verdict: {autoVerdict ? "AUTO-PASS" : "AUTO-FAIL"}
              </strong>{" "}
              — computed against the Maximum Permissible Error for{" "}
              {instrument.accuracyClass} at e = 10 g. The officer cannot
              override a fail; only a re-test after rectification can clear it.
            </p>
          </div>
        </Panel>

        <Panel title="Physical inspection checklist">
          <ul className="space-y-2.5">
            {checklist.map((item) => (
              <li key={item}>
                <label className="flex cursor-pointer items-start gap-2.5 text-[12.5px] text-ink">
                  <input
                    checked={checked.includes(item)}
                    className="mt-0.5 size-4 shrink-0 accent-[#0b2b5c]"
                    disabled={locked}
                    onChange={() =>
                      setChecked((current) =>
                        current.includes(item)
                          ? current.filter((value) => value !== item)
                          : [...current, item],
                      )
                    }
                    type="checkbox"
                  />
                  {item}
                </label>
              </li>
            ))}
          </ul>

          <div className="mt-4">
            <p className="mb-1.5 text-xs font-semibold text-ink">
              Officer remarks
            </p>
            <Textarea
              disabled={locked}
              placeholder="Recorded verbatim on the certificate or the rejection notice."
              rows={3}
            />
          </div>
        </Panel>
      </div>

      {/* ---------------------------------------------------- Action rail */}
      <aside className="space-y-4 xl:sticky xl:top-20 xl:self-start">
        <Panel title="Bind the digital seal">
          <p className="text-[12px] leading-4.5 text-ink-muted">
            Scan the QR on the new tamper-evident sticker before issuing. The
            sticker number is permanently bound to this instrument record.
          </p>

          {seal ? (
            <div className="mt-3 flex items-center gap-3 rounded-gov border border-india-green/30 bg-india-green/8 p-3">
              <CircleCheckBig
                className="size-6 shrink-0 text-india-green"
                aria-hidden
              />
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold text-ink">
                  Seal bound
                </p>
                <p className="num truncate text-[11px] text-ink-muted">
                  {seal}
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-3 flex aspect-[4/2.2] flex-col items-center justify-center gap-1.5 rounded-gov border border-dashed border-line bg-surface-alt">
              <QrCode className="size-7 text-ink-muted/50" aria-hidden />
              <p className="text-[11px] text-ink-muted">
                Camera preview appears here
              </p>
            </div>
          )}

          <Button
            block
            className="mt-2"
            disabled={locked}
            onClick={() => setSeal(seal ? "" : "QR-UP-2025-77120")}
            size="sm"
            variant={seal ? "secondary" : "primary"}
          >
            {seal ? (
              <>
                <ScanLine className="size-3.5" aria-hidden />
                Rescan sticker
              </>
            ) : (
              <>
                <QrCode className="size-3.5" aria-hidden />
                Scan sticker with camera
              </>
            )}
          </Button>
        </Panel>

        <Panel title="Complete inspection">
          {locked ? (
            <p className="flex items-start gap-2 rounded-gov bg-amber-50 p-3 text-[11.5px] leading-4 text-amber-900">
              <TriangleAlert className="mt-px size-4 shrink-0" aria-hidden />
              Actions stay disabled until the geo-fence is satisfied. This is
              what prevents desk-issued stamping.
            </p>
          ) : (
            <ul className="mb-3 space-y-1.5 text-[11.5px] text-ink-muted">
              <li className="flex items-center gap-1.5">
                <CircleCheckBig
                  className="size-3.5 text-india-green"
                  aria-hidden
                />
                Location matched (11 m)
              </li>
              <li className="flex items-center gap-1.5">
                {autoVerdict ? (
                  <CircleCheckBig
                    className="size-3.5 text-india-green"
                    aria-hidden
                  />
                ) : (
                  <CircleX className="size-3.5 text-red-600" aria-hidden />
                )}
                Calibration {autoVerdict ? "within" : "beyond"} MPE
              </li>
              <li className="flex items-center gap-1.5">
                {checked.length === checklist.length ? (
                  <CircleCheckBig
                    className="size-3.5 text-india-green"
                    aria-hidden
                  />
                ) : (
                  <CircleX className="size-3.5 text-amber-600" aria-hidden />
                )}
                Checklist {checked.length}/{checklist.length}
              </li>
              <li className="flex items-center gap-1.5">
                {seal ? (
                  <CircleCheckBig
                    className="size-3.5 text-india-green"
                    aria-hidden
                  />
                ) : (
                  <CircleX className="size-3.5 text-amber-600" aria-hidden />
                )}
                Seal {seal ? "bound" : "not scanned"}
              </li>
            </ul>
          )}

          <Button
            block
            disabled={locked || !autoVerdict || !seal}
            onClick={() => setIssued("passed")}
            variant="success"
          >
            <Stamp className="size-4" aria-hidden />
            Pass &amp; issue certificate
          </Button>

          <Button
            block
            className="mt-2"
            disabled={locked}
            onClick={() => setIssued("rejected")}
            variant="danger"
          >
            <CircleX className="size-4" aria-hidden />
            Reject instrument
          </Button>

          <Link
            className="mt-3 block text-center text-[11px] text-navy-500 hover:underline"
            href={`/lmo/inspections/${inspection.id}/re-test`}
          >
            This is a re-test — open delta comparison
          </Link>
        </Panel>
      </aside>
    </div>
  );
};