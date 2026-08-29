"use client";

import {
  ArrowLeft,
  Ban,
  CameraOff,
  CircleCheckBig,
  Loader2,
  Navigation,
  RefreshCw,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { instruments } from "@/lib/data";

type Result =
  | { kind: "allow"; instrument: (typeof instruments)[number] }
  | { kind: "block"; instrument: (typeof instruments)[number] }
  | null;

/** Live rear-camera preview state for the viewfinder. */
type Camera = "starting" | "live" | "denied" | "unsupported";

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
 * type, one decision per screen. The viewfinder shows the real rear camera so
 * the act of scanning is physical — the guard aims the device at the sticker.
 */
export const GatekeeperScanner = () => {
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<Result>(null);
  const [camera, setCamera] = useState<Camera>("starting");

  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | undefined>(undefined);

  const stopCamera = useCallback(() => {
    for (const track of streamRef.current?.getTracks() ?? []) {
      track.stop();
    }
    streamRef.current = null;
  }, []);

  const startCamera = useCallback(async () => {
    stopCamera();

    if (!navigator.mediaDevices?.getUserMedia) {
      setCamera("unsupported");
      return;
    }

    setCamera("starting");
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        // Rear camera on a handheld; falls back to whatever a laptop offers.
        video: { facingMode: { ideal: "environment" } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCamera("live");
    } catch {
      // Permission refused, no device, or a non-secure origin.
      setCamera("denied");
    }
  }, [stopCamera]);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
      window.clearTimeout(timerRef.current);
    };
  }, [startCamera, stopCamera]);

  const scan = (index: number) => {
    window.clearTimeout(timerRef.current);
    setResult(null);
    setScanning(true);
    timerRef.current = window.setTimeout(() => {
      const instrument = instruments[index];
      setScanning(false);
      setResult({
        kind: instrument.status === "valid" ? "allow" : "block",
        instrument,
      });
    }, 1100);
  };

  const allowed = result?.kind === "allow";

  return (
    <div className="flex min-h-screen flex-col bg-navy-900 text-white">
      <header className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
        <Link
          className="flex shrink-0 items-center gap-2 text-xs font-semibold text-white/70 hover:text-white"
          href="/"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Exit gate mode
        </Link>
        <p className="truncate text-right text-[11px] uppercase tracking-[0.14em] text-white/50">
          Mundera Mandi · Gate #3 · Terminal G3-02
        </p>
      </header>

      {/*
        Verdict first on a phone — the guard needs the decision, not the
        viewfinder, the moment the scan lands.
      */}
      <div className="mx-auto grid w-full max-w-5xl flex-1 grid-rows-[auto_auto] gap-5 px-4 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:grid-rows-1">
        <div className="row-start-2 lg:row-start-1">
          {/* Viewfinder */}
          <div className="relative aspect-4/3 overflow-hidden rounded-lg border border-white/12 bg-black">
            <video
              aria-label="Live camera viewfinder"
              autoPlay
              className={`size-full object-cover transition-opacity duration-500 ${
                camera === "live" ? "opacity-100" : "opacity-0"
              }`}
              muted
              playsInline
              ref={videoRef}
            />

            {camera === "live" ? null : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
                {camera === "starting" ? (
                  <>
                    <Loader2
                      aria-hidden
                      className="size-8 animate-spin text-white/40"
                    />
                    <p className="text-sm text-white/60">Starting camera…</p>
                  </>
                ) : (
                  <>
                    <CameraOff aria-hidden className="size-8 text-saffron" />
                    <p className="text-sm text-white/70">
                      {camera === "unsupported"
                        ? "This device has no camera the browser can use."
                        : "Camera blocked. Allow camera access to read QR seals."}
                    </p>
                    {camera === "denied" ? (
                      <button
                        className="inline-flex items-center gap-2 rounded-gov border border-white/25 px-3 py-1.5 text-xs font-semibold hover:bg-white/10"
                        onClick={startCamera}
                        type="button"
                      >
                        <RefreshCw className="size-3.5" aria-hidden />
                        Retry
                      </button>
                    ) : null}
                  </>
                )}
              </div>
            )}

            {/* Aiming frame — brackets sit exactly on the frame's corners. */}
            <div className="pointer-events-none absolute inset-8">
              <div className="absolute inset-0 rounded-md border-2 border-white/25" />
              {[
                "-left-px -top-px rounded-tl-md border-l-4 border-t-4",
                "-right-px -top-px rounded-tr-md border-r-4 border-t-4",
                "-bottom-px -left-px rounded-bl-md border-b-4 border-l-4",
                "-bottom-px -right-px rounded-br-md border-b-4 border-r-4",
              ].map((corner) => (
                <span
                  aria-hidden
                  className={`absolute size-10 border-saffron ${corner}`}
                  key={corner}
                />
              ))}
              {scanning ? (
                <span
                  aria-hidden
                  className="scan-sweep absolute inset-x-0 top-0 h-0.5 bg-saffron shadow-[0_0_18px_2px_rgba(255,153,51,0.75)]"
                  style={
                    { "--scan-travel": "calc(100% - 2px)" } as CSSProperties
                  }
                />
              ) : null}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/55 py-3 text-xs text-white/75">
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
              className="rounded-gov border border-white/15 bg-white/8 px-4 py-3 text-sm font-semibold hover:bg-white/14 disabled:opacity-50"
              disabled={scanning}
              onClick={() => scan(0)}
              type="button"
            >
              Simulate scan — valid sticker
            </button>
            <button
              className="rounded-gov border border-white/15 bg-white/8 px-4 py-3 text-sm font-semibold hover:bg-white/14 disabled:opacity-50"
              disabled={scanning}
              onClick={() => scan(3)}
              type="button"
            >
              Simulate scan — expired sticker
            </button>
          </div>
        </div>

        <div className="row-start-1 flex flex-col gap-4">
          {/* Verdict — reserves its height so the panel never jumps on scan. */}
          <div className="flex min-h-72 flex-col">
            {result ? (
              <div
                className={`flex-1 rounded-lg border p-5 ${
                  allowed
                    ? "border-india-green/50 bg-india-green"
                    : "border-danger/50 bg-danger"
                }`}
              >
                {allowed ? (
                  <CircleCheckBig className="size-10" aria-hidden />
                ) : (
                  <Ban className="size-10" aria-hidden />
                )}
                <h1 className="mt-3 font-serif text-3xl font-bold leading-tight">
                  {allowed ? "Entry Allowed" : "Entry Blocked"}
                </h1>
                <p className="mt-1.5 text-sm text-white/85">
                  {allowed
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

                {allowed ? null : (
                  <p className="mt-4 flex items-center gap-2 rounded-gov bg-black/25 px-3 py-2.5 text-sm font-semibold">
                    <Navigation className="size-4" aria-hidden />
                    Redirect vendor to the camp van at Gate #3
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-1 flex-col items-center justify-center rounded-lg border border-dashed border-white/15 bg-white/4 p-8 text-center">
                <ShieldCheck className="size-10 text-white/25" aria-hidden />
                <p className="mt-3 text-sm text-white/55">
                  Awaiting scan. Every vendor entering the wholesale yard must
                  present a stamped instrument.
                </p>
              </div>
            )}
          </div>

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
              <p className="text-2xl font-bold text-saffron">
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
                        ? "font-semibold text-india-green"
                        : "font-semibold text-saffron"
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
