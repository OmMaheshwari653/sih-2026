"use client";

import {
  ArrowLeft,
  Ban,
  CircleCheckBig,
  Loader2,
  Navigation,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { instruments } from "@/lib/data";

type Result =
  | { kind: "allow"; instrument: (typeof instruments)[number] }
  | { kind: "block"; instrument: (typeof instruments)[number] }
  | null;

const queue = [
  { time: "07:42", vendor: "Ramesh Sabzi — Stall 12", verdict: "Allowed" },
  {
    time: "07:39",
    vendor: "Nandini Vegetables — Stall 44",
    verdict: "Blocked",
  },
  { time: "07:36", vendor: "Iqbal Fruits — Stall 07", verdict: "Allowed" },
  { time: "07:31", vendor: "Sharma Dry Fruits — Stall 21", verdict: "Allowed" },
];

/**
 * Built for a guard holding a rugged handheld in daylight: dark plate, huge
 * type, one decision per screen.
 */
export const GatekeeperScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result>(null);

  const scan = (index: number) => {
    setResult(null);
    setScanning(true);
    window.setTimeout(() => {
      const instrument = instruments[index];
      setScanning(false);
      setResult({
        kind: instrument.status === "valid" ? "allow" : "block",
        instrument,
      });
    }, 1100);
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#0a0f18] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <Link
          className="flex items-center gap-2 text-xs text-white/60 hover:text-white"
          href="/"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Exit gate mode
        </Link>
        <p className="text-[11px] uppercase tracking-[0.14em] text-white/50">
          Mundera Mandi · Gate #3 · Terminal G3-02
        </p>
      </header>

      <div className="mx-auto grid w-full max-w-5xl flex-1 gap-5 px-4 py-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          {/* Viewfinder */}
          <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-white/12 bg-black/60">
            <div
              aria-hidden
              className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_50%_45%,#39506e_0%,transparent_60%)]"
            />
            <div className="absolute inset-8 rounded-md border-2 border-white/25" />
            {[
              "left-6 top-6 border-l-4 border-t-4",
              "right-6 top-6 border-r-4 border-t-4",
              "left-6 bottom-6 border-b-4 border-l-4",
              "right-6 bottom-6 border-b-4 border-r-4",
            ].map((corner) => (
              <span
                aria-hidden
                className={`absolute size-10 border-emerald-400 ${corner}`}
                key={corner}
              />
            ))}
            {scanning ? (
              <span
                aria-hidden
                className="absolute inset-x-8 top-1/2 h-0.5 animate-pulse bg-emerald-400 shadow-[0_0_18px_2px_rgba(52,211,153,0.7)]"
              />
            ) : null}

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/45 py-3 text-xs text-white/70">
              {scanning ? (
                <>
                  <Loader2 className="size-4 animate-spin" aria-hidden />
                  Reading QR seal…
                </>
              ) : (
                <>
                  <ScanLine className="size-4" aria-hidden />
                  Hold the vendor&apos;s scale sticker inside the frame
                </>
              )}
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            <button
              className="rounded-gov border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10"
              onClick={() => scan(0)}
              type="button"
            >
              Simulate scan — valid sticker
            </button>
            <button
              className="rounded-gov border border-white/15 bg-white/5 px-4 py-3 text-sm font-semibold hover:bg-white/10"
              onClick={() => scan(3)}
              type="button"
            >
              Simulate scan — expired sticker
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Verdict */}
          {result ? (
            <div
              className={`rounded-lg p-5 ${
                result.kind === "allow" ? "bg-emerald-600" : "bg-red-700"
              }`}
            >
              {result.kind === "allow" ? (
                <CircleCheckBig className="size-10" aria-hidden />
              ) : (
                <Ban className="size-10" aria-hidden />
              )}
              <h1 className="mt-3 font-serif text-3xl font-bold leading-tight">
                {result.kind === "allow" ? "Entry Allowed" : "Entry Blocked"}
              </h1>
              <p className="mt-1.5 text-sm text-white/85">
                {result.kind === "allow"
                  ? `Scale valid until ${result.instrument.validTill}.`
                  : "Stamping has expired. Vendor must get re-verified before trading."}
              </p>

              <dl className="num mt-4 space-y-1.5 border-t border-white/25 pt-3 text-xs text-white/85">
                <div className="flex justify-between gap-3">
                  <dt>Instrument</dt>
                  <dd className="font-semibold">{result.instrument.id}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Type</dt>
                  <dd className="font-semibold">{result.instrument.name}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt>Last stamped</dt>
                  <dd className="font-semibold">
                    {result.instrument.stampedOn}
                  </dd>
                </div>
              </dl>

              {result.kind === "block" ? (
                <p className="mt-4 flex items-center gap-2 rounded-gov bg-black/25 px-3 py-2.5 text-sm font-semibold">
                  <Navigation className="size-4" aria-hidden />
                  Redirect vendor to the camp van at Gate #3
                </p>
              ) : null}
            </div>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 p-8 text-center">
              <ShieldCheck className="size-10 text-white/25" aria-hidden />
              <p className="mt-3 text-sm text-white/55">
                Awaiting scan. Every vendor entering the wholesale yard must
                present a stamped instrument.
              </p>
            </div>
          )}

          <div className="rounded-lg border border-white/10 bg-white/4 p-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
              Today at this gate
            </p>
            <div className="num mt-3 flex gap-6">
              <p className="text-2xl font-bold">
                214
                <span className="ml-1.5 text-[11px] font-normal text-white/50">
                  allowed
                </span>
              </p>
              <p className="text-2xl font-bold text-red-300">
                17
                <span className="ml-1.5 text-[11px] font-normal text-white/50">
                  blocked
                </span>
              </p>
            </div>

            <ul className="mt-3 divide-y divide-white/8 text-xs">
              {queue.map((entry) => (
                <li
                  className="flex items-center justify-between gap-3 py-2"
                  key={entry.vendor}
                >
                  <span className="num text-white/45">{entry.time}</span>
                  <span className="flex-1 truncate text-white/80">
                    {entry.vendor}
                  </span>
                  <span
                    className={
                      entry.verdict === "Allowed"
                        ? "text-emerald-400"
                        : "text-red-400"
                    }
                  >
                    {entry.verdict}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
