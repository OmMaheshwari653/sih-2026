"use client";

import jsQR from "jsqr";
import {
  ArrowLeft,
  Ban,
  CameraOff,
  CircleCheckBig,
  Loader2,
  Navigation,
  RefreshCw,
  RotateCcw,
  ScanLine,
  ShieldCheck,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Instrument } from "@/lib/data";
import { instruments } from "@/lib/data";
import { resolveInstrument } from "@/lib/qr";

/**
 * `BarcodeDetector` is not in the TS DOM lib yet. It is hardware-accelerated on
 * Android handhelds — the actual gate device — so it is preferred over the
 * jsQR software fallback used everywhere else.
 */
type BarcodeDetectorLike = {
  detect: (source: CanvasImageSource) => Promise<{ rawValue: string }[]>;
};
declare global {
  interface Window {
    BarcodeDetector?: new (options?: {
      formats?: string[];
    }) => BarcodeDetectorLike;
  }
}

type Verdict =
  | { kind: "allow" | "warn" | "block"; code: string; instrument: Instrument }
  | { kind: "unknown"; code: string; instrument?: undefined };

/** Live rear-camera preview state for the viewfinder. */
type Camera = "starting" | "live" | "denied" | "unsupported";

type LogEntry = { id: string; time: string; label: string; allowed: boolean };

/** Ignore repeat reads of the same sticker while it is still in frame. */
const RESCAN_COOLDOWN_MS = 4000;
/** jsQR on a full frame is expensive; decode a few times a second instead. */
const DECODE_INTERVAL_MS = 160;
/** Downscale before decoding — QR finder patterns survive it, the CPU thanks you. */
const DECODE_WIDTH = 480;

const seededLog: LogEntry[] = [
  { id: "s1", time: "07:42", label: "Ramesh Sabzi — Stall 12", allowed: true },
  {
    id: "s2",
    time: "07:39",
    label: "Nandini Vegetables — Stall 44",
    allowed: false,
  },
  { id: "s3", time: "07:36", label: "Iqbal Fruits — Stall 07", allowed: true },
];

const clockNow = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

/**
 * A gate decision from a scanned payload. An instrument that is merely
 * expiring is still legally stamped, so it lets the vendor in with a warning;
 * anything unstamped, lapsed or unknown is turned away.
 */
const judge = (code: string): Verdict => {
  const instrument = resolveInstrument(code);
  if (!instrument) {
    return { kind: "unknown", code };
  }
  if (instrument.status === "valid") {
    return { kind: "allow", code, instrument };
  }
  if (instrument.status === "expiring") {
    return { kind: "warn", code, instrument };
  }
  return { kind: "block", code, instrument };
};

/**
 * Built for a guard holding a rugged handheld in daylight: dark plate, huge
 * type, one decision per screen. The rear camera runs a real QR decode loop —
 * aiming the device at a sticker is what produces the verdict.
 */
export const GatekeeperScanner = () => {
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [camera, setCamera] = useState<Camera>("starting");
  const [log, setLog] = useState<LogEntry[]>(seededLog);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const detectorRef = useRef<BarcodeDetectorLike | null>(null);
  const lastDecodeRef = useRef(0);
  const lastCodeRef = useRef<{ code: string; at: number } | null>(null);

  const record = useCallback((next: Verdict) => {
    const now = Date.now();
    const previous = lastCodeRef.current;
    if (
      previous &&
      previous.code === next.code &&
      now - previous.at < RESCAN_COOLDOWN_MS
    ) {
      return;
    }
    lastCodeRef.current = { code: next.code, at: now };

    setVerdict(next);
    setLog((entries) =>
      [
        {
          id: `${next.code}-${now}`,
          time: clockNow(),
          label: next.instrument
            ? `${next.instrument.name} — ${next.instrument.id}`
            : `Unrecognised sticker — ${next.code || "unreadable"}`,
          allowed: next.kind === "allow" || next.kind === "warn",
        },
        ...entries,
      ].slice(0, 8),
    );
  }, []);

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
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1280 },
          height: { ideal: 960 },
        },
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
    return stopCamera;
  }, [startCamera, stopCamera]);

  // Decode loop — runs only while the preview is actually live.
  useEffect(() => {
    if (camera !== "live") {
      return;
    }

    if (!detectorRef.current && typeof window.BarcodeDetector === "function") {
      try {
        detectorRef.current = new window.BarcodeDetector({
          formats: ["qr_code"],
        });
      } catch {
        // Formats unsupported on this build — jsQR handles it.
        detectorRef.current = null;
      }
    }

    let cancelled = false;

    const readFrame = async () => {
      const video = videoRef.current;
      if (!video || video.readyState < video.HAVE_CURRENT_DATA) {
        return;
      }

      const scale = Math.min(1, DECODE_WIDTH / video.videoWidth);
      const width = Math.round(video.videoWidth * scale);
      const height = Math.round(video.videoHeight * scale);
      if (!width || !height) {
        return;
      }

      canvasRef.current ??= document.createElement("canvas");
      const canvas = canvasRef.current;
      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d", { willReadFrequently: true });
      if (!context) {
        return;
      }
      context.drawImage(video, 0, 0, width, height);

      if (detectorRef.current) {
        const [hit] = await detectorRef.current.detect(canvas);
        if (hit?.rawValue) {
          record(judge(hit.rawValue));
        }
        return;
      }

      const frame = context.getImageData(0, 0, width, height);
      const hit = jsQR(frame.data, width, height, {
        inversionAttempts: "dontInvert",
      });
      if (hit?.data) {
        record(judge(hit.data));
      }
    };

    const tick: FrameRequestCallback = async (timestamp) => {
      if (cancelled) {
        return;
      }
      if (timestamp - lastDecodeRef.current >= DECODE_INTERVAL_MS) {
        lastDecodeRef.current = timestamp;
        try {
          await readFrame();
        } catch {
          // A dropped frame is not worth tearing the loop down for.
        }
      }
      if (!cancelled) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      cancelled = true;
      if (frameRef.current !== undefined) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [camera, record]);

  /** Bench testing when no printed sticker is at hand. */
  const simulate = (index: number) => {
    lastCodeRef.current = null;
    record(judge(instruments[index].id));
  };

  const clear = () => {
    lastCodeRef.current = null;
    setVerdict(null);
  };

  const admitted = verdict?.kind === "allow" || verdict?.kind === "warn";
  const aiming = camera === "live" && !verdict;

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
              {aiming ? (
                <span
                  aria-hidden
                  className="scan-sweep absolute inset-x-0 top-0 h-0.5 bg-saffron shadow-[0_0_18px_2px_rgba(255,153,51,0.75)]"
                  style={
                    { "--scan-travel": "calc(100% - 2px)" } as CSSProperties
                  }
                />
              ) : null}
            </div>

            <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-2 bg-black/55 py-3 text-center text-xs text-white/75">
              {aiming ? (
                <>
                  <ScanLine className="size-4 shrink-0" aria-hidden />
                  Hold the vendor&apos;s scale sticker inside the frame
                </>
              ) : verdict ? (
                <>
                  <ScanLine className="size-4 shrink-0" aria-hidden />
                  <span className="num truncate">
                    Read: {verdict.code || "unreadable"}
                  </span>
                </>
              ) : (
                <>
                  <Loader2
                    className="size-4 shrink-0 animate-spin"
                    aria-hidden
                  />
                  Preparing scanner…
                </>
              )}
            </div>
          </div>

          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <button
              className="rounded-gov border border-white/15 bg-white/8 px-4 py-3 text-sm font-semibold hover:bg-white/14"
              onClick={() => simulate(0)}
              type="button"
            >
              Test — valid
            </button>
            <button
              className="rounded-gov border border-white/15 bg-white/8 px-4 py-3 text-sm font-semibold hover:bg-white/14"
              onClick={() => simulate(3)}
              type="button"
            >
              Test — expired
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-gov border border-white/15 bg-white/8 px-4 py-3 text-sm font-semibold hover:bg-white/14 disabled:opacity-40"
              disabled={!verdict}
              onClick={clear}
              type="button"
            >
              <RotateCcw className="size-4" aria-hidden />
              Next vendor
            </button>
          </div>
        </div>

        <div className="row-start-1 flex flex-col gap-4">
          {/* Verdict — reserves its height so the panel never jumps on scan. */}
          <div className="flex min-h-72 flex-col">
            {verdict ? (
              <div
                className={`flex-1 rounded-lg border p-5 ${
                  verdict.kind === "allow"
                    ? "border-india-green/50 bg-india-green"
                    : verdict.kind === "warn"
                      ? "border-saffron/50 bg-saffron text-navy-900"
                      : "border-danger/50 bg-danger"
                }`}
              >
                {verdict.kind === "allow" ? (
                  <CircleCheckBig className="size-10" aria-hidden />
                ) : verdict.kind === "warn" ? (
                  <TriangleAlert className="size-10" aria-hidden />
                ) : (
                  <Ban className="size-10" aria-hidden />
                )}
                <h1 className="mt-3 font-serif text-3xl font-bold leading-tight">
                  {verdict.kind === "allow"
                    ? "Entry Allowed"
                    : verdict.kind === "warn"
                      ? "Allowed — expiring"
                      : "Entry Blocked"}
                </h1>
                <p
                  className={`mt-1.5 text-sm ${
                    verdict.kind === "warn"
                      ? "text-navy-900/80"
                      : "text-white/85"
                  }`}
                >
                  {verdict.kind === "allow"
                    ? `Scale valid until ${verdict.instrument.validTill}.`
                    : verdict.kind === "warn"
                      ? `Stamping lapses on ${verdict.instrument.validTill}. Tell the vendor to book re-verification.`
                      : verdict.kind === "unknown"
                        ? "No stamping record exists for this sticker. Treat it as counterfeit."
                        : "Stamping is not valid. Vendor must get re-verified before trading."}
                </p>

                {verdict.instrument ? (
                  <dl
                    className={`num mt-4 space-y-1.5 border-t pt-3 text-xs ${
                      verdict.kind === "warn"
                        ? "border-navy-900/25 text-navy-900/85"
                        : "border-white/25 text-white/85"
                    }`}
                  >
                    <div className="flex justify-between gap-3">
                      <dt>Instrument</dt>
                      <dd className="font-semibold">{verdict.instrument.id}</dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Type</dt>
                      <dd className="font-semibold">
                        {verdict.instrument.name}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-3">
                      <dt>Last stamped</dt>
                      <dd className="font-semibold">
                        {verdict.instrument.stampedOn}
                      </dd>
                    </div>
                  </dl>
                ) : (
                  <p className="num mt-4 break-all border-t border-white/25 pt-3 text-xs text-white/85">
                    Payload: {verdict.code || "could not be read"}
                  </p>
                )}

                {admitted ? null : (
                  <p className="mt-4 flex items-center gap-2 rounded-gov bg-black/25 px-3 py-2.5 text-sm font-semibold">
                    <Navigation className="size-4 shrink-0" aria-hidden />
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
                {211 + log.filter((entry) => entry.allowed).length}
                <span className="ml-1.5 text-[11px] font-normal text-white/50">
                  allowed
                </span>
              </p>
              <p className="text-2xl font-bold text-saffron">
                {16 + log.filter((entry) => !entry.allowed).length}
                <span className="ml-1.5 text-[11px] font-normal text-white/50">
                  blocked
                </span>
              </p>
            </div>

            <ul className="mt-3 divide-y divide-white/8 text-xs">
              {log.map((entry) => (
                <li
                  className="flex items-center justify-between gap-3 py-2"
                  key={entry.id}
                >
                  <span className="num shrink-0 text-white/45">
                    {entry.time}
                  </span>
                  <span className="flex-1 truncate text-white/80">
                    {entry.label}
                  </span>
                  <span
                    className={
                      entry.allowed
                        ? "shrink-0 font-semibold text-india-green-300"
                        : "shrink-0 font-semibold text-saffron"
                    }
                  >
                    {entry.allowed ? "Allowed" : "Blocked"}
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
