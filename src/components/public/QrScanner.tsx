"use client";

import { animate, stagger } from "animejs";
import jsQR from "jsqr";
import {
  ArrowRight,
  Ban,
  CameraOff,
  CircleCheckBig,
  FlagTriangleRight,
  Loader2,
  RefreshCw,
  RotateCcw,
  Search,
  ShieldQuestion,
  TriangleAlert,
  Truck,
  X,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAnimeScope } from "@/lib/anime";
import type { Instrument } from "@/lib/data";
import { extractQrId, resolveInstrument } from "@/lib/qr";

/**
 * `BarcodeDetector` is not in the TS DOM lib yet. It is hardware-accelerated on
 * Android phones, so it is preferred over the jsQR software fallback.
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
  | {
      kind: "valid" | "expiring" | "invalid";
      code: string;
      instrument: Instrument;
    }
  | { kind: "unknown"; code: string; instrument?: undefined };

/** Live rear-camera preview state for the viewfinder. */
type Camera = "starting" | "live" | "denied" | "unsupported";

type LogEntry = { id: string; verdict: Verdict };

/** Ignore repeat reads of the same sticker while it is still in frame. */
const RESCAN_COOLDOWN_MS = 4000;
/** jsQR on a full frame is expensive; decode a few times a second instead. */
const DECODE_INTERVAL_MS = 160;
/** Downscale before decoding — QR finder patterns survive it, the CPU thanks you. */
const DECODE_WIDTH = 480;

const samples = [
  { id: "LM-UP-PRY-000123", label: "Valid" },
  { id: "LM-UP-PRY-000124", label: "Expiring" },
  { id: "LM-UP-PRY-000126", label: "Expired" },
  { id: "LM-XX-FAKE-999999", label: "Fake" },
];

/**
 * What a customer needs to know from a scanned payload. An instrument that is
 * merely expiring is still legally stamped; anything lapsed, rejected or
 * unknown should not be trusted.
 */
const judge = (code: string): Verdict => {
  const instrument = resolveInstrument(code);
  if (!instrument) {
    return { kind: "unknown", code: extractQrId(code) || code };
  }
  if (instrument.status === "valid") {
    return { kind: "valid", code, instrument };
  }
  if (instrument.status === "expiring") {
    return { kind: "expiring", code, instrument };
  }
  return { kind: "invalid", code, instrument };
};

const verdictCopy = {
  valid: {
    title: "Legally stamped",
    tone: "from-emerald-400 via-emerald-600 to-teal-800 text-white",
    icon: CircleCheckBig,
  },
  expiring: {
    title: "Valid — expiring soon",
    tone: "from-amber-300 via-orange-400 to-orange-600 text-navy-900",
    icon: TriangleAlert,
  },
  invalid: {
    title: "Do not trust this scale",
    tone: "from-red-500 via-red-600 to-rose-800 text-white",
    icon: Ban,
  },
  unknown: {
    title: "No record — likely fake",
    tone: "from-red-500 via-red-600 to-rose-800 text-white",
    icon: ShieldQuestion,
  },
} as const;

const logDot: Record<Verdict["kind"], string> = {
  valid: "bg-emerald-500",
  expiring: "bg-amber-400",
  invalid: "bg-red-500",
  unknown: "bg-red-500",
};

/**
 * Point the phone at the sticker on a shop scale and get the stamping status
 * on the spot. Everything — camera, result, typed lookup and recent scans —
 * lives in one screen, so the result lands where the user is already looking.
 */
export const QrScanner = () => {
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [camera, setCamera] = useState<Camera>("starting");
  const [log, setLog] = useState<LogEntry[]>([]);
  const [manual, setManual] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameRef = useRef<number | undefined>(undefined);
  const detectorRef = useRef<BarcodeDetectorLike | null>(null);
  const lastDecodeRef = useRef(0);
  const lastCodeRef = useRef<{ code: string; at: number } | null>(null);
  const verdictRef = useRef<HTMLDivElement>(null);

  // Corner brackets breathe while the scanner waits.
  const viewfinder = useAnimeScope<HTMLDivElement>(() => {
    animate("[data-bracket]", {
      scale: [1, 1.08],
      opacity: [0.7, 1],
      duration: 1100,
      delay: stagger(120),
      loop: true,
      alternate: true,
      ease: "inOutSine",
    });
  });

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
        { id: `${next.code}-${now}`, verdict: next },
        ...entries.filter((entry) => entry.verdict.code !== next.code),
      ].slice(0, 5),
    );
    // A short buzz on phones confirms the read without looking.
    navigator.vibrate?.(next.kind === "valid" ? 40 : [60, 60, 60]);
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
        // Rear camera on a phone; falls back to whatever a laptop offers.
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

  // Decode loop — runs only while the preview is live and no result is open.
  useEffect(() => {
    if (camera !== "live" || verdict) {
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
  }, [camera, verdict, record]);

  // Each new verdict lands with a spring so the result is impossible to miss.
  useEffect(() => {
    const el = verdictRef.current;
    if (
      !verdict ||
      !el ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const animations = [
      animate(el, {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.96, 1],
        duration: 900,
        ease: "outElastic(1, .8)",
      }),
      animate(el.querySelectorAll("[data-verdict-icon]"), {
        scale: [0, 1],
        rotate: [-40, 0],
        duration: 1000,
        delay: 100,
        ease: "outElastic(1, .5)",
      }),
      animate(el.querySelectorAll("[data-verdict-item]"), {
        opacity: [0, 1],
        translateY: [10, 0],
        duration: 550,
        delay: stagger(45, { start: 160 }),
        ease: "outExpo",
      }),
    ];
    return () => {
      for (const animation of animations) {
        animation.revert();
      }
    };
  }, [verdict]);

  /** Sample stickers and typed ids skip the cooldown — the user asked for them. */
  const check = (code: string) => {
    lastCodeRef.current = null;
    record(judge(code));
  };

  const clear = () => {
    lastCodeRef.current = null;
    setVerdict(null);
  };

  const aiming = camera === "live" && !verdict;
  const copy = verdict ? verdictCopy[verdict.kind] : null;

  return (
    <div className="flex h-full min-h-0 flex-col gap-3" data-motion-manual>
      {/* ------------------------------------------------------ Viewfinder */}
      <div
        className="aurora-dark relative min-h-72 flex-1 overflow-hidden rounded-4xl text-white shadow-[0_30px_60px_-30px_rgb(9_14_38/0.6)]"
        ref={viewfinder}
      >
        <video
          aria-label="Live camera viewfinder"
          autoPlay
          className={`absolute inset-0 size-full object-cover transition-opacity duration-500 ${
            camera === "live" ? "opacity-100" : "opacity-0"
          }`}
          muted
          playsInline
          ref={videoRef}
        />

        {/* Aiming frame, nudged left on desktop while a result is open. */}
        <div
          className={`pointer-events-none absolute top-1/2 aspect-square w-[min(62%,19rem)] -translate-x-1/2 -translate-y-1/2 transition-[left] duration-700 ease-glass ${
            verdict ? "left-1/2 lg:left-[calc(50%-13rem)]" : "left-1/2"
          }`}
        >
          {[
            "-left-px -top-px rounded-tl-3xl border-l-4 border-t-4",
            "-right-px -top-px rounded-tr-3xl border-r-4 border-t-4",
            "-bottom-px -left-px rounded-bl-3xl border-b-4 border-l-4",
            "-bottom-px -right-px rounded-br-3xl border-b-4 border-r-4",
          ].map((corner) => (
            <span
              aria-hidden
              className={`absolute size-14 border-white/90 ${corner}`}
              data-bracket
              key={corner}
            />
          ))}
          {aiming ? (
            <span
              aria-hidden
              className="scan-sweep absolute inset-x-3 top-0 h-0.5 rounded-full bg-sky-300 shadow-[0_0_24px_4px_rgb(125_211_252/0.8)]"
              style={{ "--scan-travel": "calc(100% - 2px)" } as CSSProperties}
            />
          ) : null}
        </div>

        {/* Camera problems sit inside the frame so the page never reflows. */}
        {camera !== "live" && !verdict ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-8 text-center">
            {camera === "starting" ? (
              <Loader2
                aria-hidden
                className="size-7 animate-spin text-white/60"
              />
            ) : (
              <>
                <span className="glass-dark flex size-12 items-center justify-center rounded-2xl">
                  <CameraOff aria-hidden className="size-5 text-orange-300" />
                </span>
                <p className="max-w-[16rem] text-sm text-white/80">
                  {camera === "unsupported"
                    ? "No camera available. Type the sticker ID below."
                    : "Camera blocked. Allow access, or type the sticker ID below."}
                </p>
                {camera === "denied" ? (
                  <button
                    className="glass-dark pointer-events-auto inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold hover:bg-white/15"
                    onClick={startCamera}
                    type="button"
                  >
                    <RefreshCw className="size-3.5" aria-hidden />
                    Retry camera
                  </button>
                ) : null}
              </>
            )}
          </div>
        ) : null}

        {/* Status pill */}
        {verdict ? null : (
          <p className="glass-dark absolute left-1/2 top-4 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs text-white/90">
            {aiming ? (
              <>
                <span className="relative flex size-2">
                  <span className="absolute inset-0 animate-ping rounded-full bg-emerald-400/70" />
                  <span className="relative size-2 rounded-full bg-emerald-400" />
                </span>
                Point at the QR sticker on the scale
              </>
            ) : camera === "starting" ? (
              "Starting camera…"
            ) : (
              <>
                <Search className="size-3.5" aria-hidden />
                Type or pick a sticker below
              </>
            )}
          </p>
        )}

        {/* --------------------------------------------------- Result */}
        {verdict && copy ? (
          <div
            aria-live="polite"
            className={`absolute inset-x-3 bottom-3 z-10 max-h-[calc(100%-1.5rem)] overflow-y-auto rounded-3xl bg-linear-to-br p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_30px_60px_-20px_rgb(0_0_0/0.6)] lg:inset-x-auto lg:bottom-4 lg:right-4 lg:max-h-[calc(100%-2rem)] lg:w-[24rem] lg:p-6 ${copy.tone}`}
            key={`${verdict.code}-${verdict.kind}`}
            ref={verdictRef}
          >
            <button
              aria-label="Close result and scan again"
              className="absolute right-3 top-3 rounded-full bg-black/15 p-1.5 transition-colors hover:bg-black/25"
              onClick={clear}
              type="button"
            >
              <X className="size-4" aria-hidden />
            </button>

            <div className="flex items-center gap-3 pr-8">
              <span
                className="glass-dark flex size-12 shrink-0 items-center justify-center rounded-2xl"
                data-verdict-icon
              >
                <copy.icon className="size-6" aria-hidden />
              </span>
              <div className="min-w-0" data-verdict-item>
                <h2 className="text-xl font-semibold leading-tight tracking-tight lg:text-2xl">
                  {copy.title}
                </h2>
                <p className="num truncate font-mono text-[11px] opacity-75">
                  {verdict.instrument?.id ?? verdict.code}
                </p>
              </div>
            </div>

            <p className="mt-3 text-sm opacity-90" data-verdict-item>
              {verdict.kind === "valid"
                ? `Verified by a Legal Metrology Officer. Valid until ${verdict.instrument.validTill}.`
                : verdict.kind === "expiring"
                  ? `Still legal today — stamping lapses on ${verdict.instrument.validTill}.`
                  : verdict.kind === "unknown"
                    ? "No stamping record exists for this sticker. Don't rely on this scale."
                    : "Stamping is not valid. The trader must get it re-verified."}
            </p>

            {verdict.instrument ? (
              <dl className="mt-3 grid grid-cols-2 gap-1.5 text-xs">
                {[
                  ["Type", verdict.instrument.name],
                  ["Last stamped", verdict.instrument.stampedOn],
                  ["Valid till", verdict.instrument.validTill],
                  ["Officer", verdict.instrument.officer.split(" (")[0]],
                ].map(([label, value]) => (
                  <div
                    className="rounded-xl bg-black/12 px-3 py-2"
                    data-verdict-item
                    key={label}
                  >
                    <dt className="text-[10px] uppercase tracking-[0.08em] opacity-70">
                      {label}
                    </dt>
                    <dd className="mt-0.5 truncate font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
            ) : null}

            <div
              className="mt-4 grid grid-cols-2 gap-2 lg:mt-5"
              data-verdict-item
            >
              <button
                className="col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-navy-900 transition-transform active:scale-[0.98]"
                onClick={clear}
                type="button"
              >
                <RotateCcw className="size-4" aria-hidden />
                Scan another
              </button>
              {verdict.instrument ? (
                <Link
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-black/20 px-3 py-2.5 text-xs font-semibold transition-colors hover:bg-black/30"
                  href={`/verify/${encodeURIComponent(verdict.instrument.id)}`}
                >
                  Full record
                  <ArrowRight className="size-3.5" aria-hidden />
                </Link>
              ) : null}
              {verdict.kind === "valid" ? null : (
                <Link
                  className="inline-flex items-center justify-center gap-1.5 rounded-full bg-black/20 px-3 py-2.5 text-xs font-semibold transition-colors hover:bg-black/30"
                  href={`/report-fraud${verdict.instrument ? `?scale=${verdict.instrument.id}` : ""}`}
                >
                  <FlagTriangleRight className="size-3.5" aria-hidden />
                  Report
                </Link>
              )}
              {verdict.kind === "invalid" ? (
                <Link
                  className="col-span-2 inline-flex items-center justify-center gap-1.5 rounded-full bg-black/20 px-3 py-2.5 text-xs font-semibold transition-colors hover:bg-black/30"
                  href="/camps"
                >
                  <Truck className="size-3.5" aria-hidden />
                  Find the nearest verification camp
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      {/* ------------------------------------------------------- Controls */}
      <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <form
          className="glass flex min-w-0 flex-1 items-center gap-2 rounded-full p-1.5 pl-4"
          onSubmit={(event) => {
            event.preventDefault();
            if (manual.trim()) {
              check(manual);
            }
          }}
        >
          <Search className="size-4 shrink-0 text-ink-muted" aria-hidden />
          <input
            aria-label="Instrument ID, serial or certificate number"
            className="min-w-0 flex-1 bg-transparent py-2 text-sm text-ink outline-none placeholder:text-ink-muted/60"
            onChange={(event) => setManual(event.target.value)}
            placeholder="Type the ID on the sticker"
            value={manual}
          />
          <button
            className="btn-ink rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:brightness-125"
            type="submit"
          >
            Check
          </button>
        </form>

        <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5 text-[11px] text-ink-muted [scrollbar-width:none]">
          <span className="shrink-0">
            {log.length ? "Recent" : "Try a sample"}
          </span>
          {log.length
            ? log.map((entry) => (
                <button
                  className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 font-medium backdrop-blur-md transition-colors ${
                    verdict?.code === entry.verdict.code
                      ? "border-ink bg-ink text-white"
                      : "border-white/80 bg-white/55 text-ink hover:bg-white"
                  }`}
                  key={entry.id}
                  onClick={() => setVerdict(entry.verdict)}
                  type="button"
                >
                  <span
                    className={`size-1.5 rounded-full ${logDot[entry.verdict.kind]}`}
                  />
                  {entry.verdict.instrument?.name ?? "Unknown sticker"}
                </button>
              ))
            : null}
          {samples
            .filter(
              (sample) =>
                !log.some((entry) => entry.verdict.code === sample.id),
            )
            .map((sample) => (
              <button
                className="shrink-0 rounded-full border border-white/80 bg-white/55 px-3 py-1.5 font-medium backdrop-blur-md transition-colors hover:bg-white hover:text-ink"
                key={sample.id}
                onClick={() => check(sample.id)}
                type="button"
              >
                {sample.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
};
