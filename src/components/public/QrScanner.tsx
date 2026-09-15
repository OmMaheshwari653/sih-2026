"use client";

import { animate, stagger } from "animejs";
import jsQR from "jsqr";
import {
  ArrowRight,
  Ban,
  CameraOff,
  CircleCheckBig,
  FlagTriangleRight,
  History,
  Loader2,
  RefreshCw,
  RotateCcw,
  ScanLine,
  Search,
  ShieldQuestion,
  TriangleAlert,
  Truck,
} from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { ConsumerArt } from "@/components/illustrations/RoleArt";
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

type LogEntry = {
  id: string;
  time: string;
  label: string;
  kind: Verdict["kind"];
};

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
  { id: "LM-XX-FAKE-999999", label: "Counterfeit" },
];

const clockNow = () =>
  new Date().toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

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
    title: "No record — likely counterfeit",
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
 * on the spot. The rear camera runs a real QR decode loop; typing the printed
 * id works when the camera is unavailable.
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

  // Corner brackets breathe while the scanner is idle.
  const viewfinder = useAnimeScope<HTMLDivElement>(() => {
    animate("[data-bracket]", {
      scale: [1, 1.12],
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
        {
          id: `${next.code}-${now}`,
          time: clockNow(),
          label: next.instrument
            ? `${next.instrument.name} — ${next.instrument.id}`
            : `Unrecognised sticker — ${next.code || "unreadable"}`,
          kind: next.kind,
        },
        ...entries,
      ].slice(0, 6),
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

  /** Sample stickers and typed ids skip the cooldown — the user asked for them. */
  const check = (code: string) => {
    lastCodeRef.current = null;
    record(judge(code));
  };

  const clear = () => {
    lastCodeRef.current = null;
    setVerdict(null);
  };

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
        scale: [0.92, 1],
        translateY: [28, 0],
        duration: 1000,
        ease: "outElastic(1, .75)",
      }),
      animate(el.querySelectorAll("[data-verdict-icon]"), {
        scale: [0, 1],
        rotate: [-40, 0],
        duration: 1100,
        delay: 120,
        ease: "outElastic(1, .5)",
      }),
      animate(el.querySelectorAll("[data-verdict-item]"), {
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 650,
        delay: stagger(55, { start: 220 }),
        ease: "outExpo",
      }),
    ];
    return () => {
      for (const animation of animations) {
        animation.revert();
      }
    };
  }, [verdict]);

  const aiming = camera === "live" && !verdict;
  const copy = verdict ? verdictCopy[verdict.kind] : null;
  const recordId = verdict?.instrument?.id ?? verdict?.code;

  return (
    <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
      {/* ------------------------------------------------------ Viewfinder */}
      <div className="order-2 lg:order-1">
        <div
          className="aurora-dark relative aspect-4/3 overflow-hidden rounded-4xl text-white shadow-[0_30px_60px_-30px_rgb(9_14_38/0.6)]"
          ref={viewfinder}
        >
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
                    className="size-8 animate-spin text-white/50"
                  />
                  <p className="text-sm text-white/70">Starting camera…</p>
                </>
              ) : (
                <>
                  <span className="glass-dark flex size-14 items-center justify-center rounded-2xl">
                    <CameraOff aria-hidden className="size-6 text-orange-300" />
                  </span>
                  <p className="max-w-xs text-sm text-white/75">
                    {camera === "unsupported"
                      ? "This device has no camera the browser can use. Type the ID printed on the sticker instead."
                      : "Camera blocked. Allow camera access to read QR stickers, or type the ID instead."}
                  </p>
                  {camera === "denied" ? (
                    <button
                      className="glass-dark inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold hover:bg-white/15"
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
          )}

          {/* Aiming frame — brackets sit exactly on the frame's corners. */}
          <div className="pointer-events-none absolute inset-x-10 bottom-20 top-10">
            {[
              "-left-px -top-px rounded-tl-2xl border-l-4 border-t-4",
              "-right-px -top-px rounded-tr-2xl border-r-4 border-t-4",
              "-bottom-px -left-px rounded-bl-2xl border-b-4 border-l-4",
              "-bottom-px -right-px rounded-br-2xl border-b-4 border-r-4",
            ].map((corner) => (
              <span
                aria-hidden
                className={`absolute size-12 border-white/90 ${corner}`}
                data-bracket
                key={corner}
              />
            ))}
            {aiming ? (
              <span
                aria-hidden
                className="scan-sweep absolute inset-x-2 top-0 h-0.5 rounded-full bg-sky-300 shadow-[0_0_24px_4px_rgb(125_211_252/0.8)]"
                style={{ "--scan-travel": "calc(100% - 2px)" } as CSSProperties}
              />
            ) : null}
          </div>

          <div className="glass-dark absolute inset-x-4 bottom-4 flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-center text-xs text-white/85">
            {aiming ? (
              <>
                <ScanLine className="size-4 shrink-0" aria-hidden />
                Hold the scale&apos;s QR sticker inside the frame
              </>
            ) : verdict ? (
              <>
                <ScanLine className="size-4 shrink-0" aria-hidden />
                <span className="num truncate font-mono">
                  Read: {verdict.code || "unreadable"}
                </span>
              </>
            ) : camera === "starting" ? (
              <>
                <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
                Preparing scanner…
              </>
            ) : (
              <>
                <Search className="size-4 shrink-0" aria-hidden />
                Type the sticker ID below instead
              </>
            )}
          </div>
        </div>

        <form
          className="glass mt-4 flex items-center gap-2 rounded-full p-1.5 pl-4"
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
            placeholder="No camera? Type the ID on the sticker"
            value={manual}
          />
          <button
            className="btn-ink rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:brightness-125"
            type="submit"
          >
            Check
          </button>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-2 px-1 text-[11px] text-ink-muted">
          <span>Try a sample sticker</span>
          {samples.map((sample) => (
            <button
              className="rounded-full border border-white/80 bg-white/55 px-3 py-1 font-medium backdrop-blur-md transition-colors hover:bg-white hover:text-ink"
              key={sample.id}
              onClick={() => check(sample.id)}
              type="button"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* --------------------------------------------------------- Verdict */}
      <div className="order-1 flex flex-col gap-4 lg:order-2">
        <div className="flex min-h-80 flex-col">
          {verdict && copy ? (
            <div
              aria-live="polite"
              key={`${verdict.code}-${verdict.kind}`}
              ref={verdictRef}
              className={`relative flex-1 overflow-hidden rounded-4xl bg-linear-to-br p-6 shadow-[inset_0_1px_0_rgb(255_255_255/0.35),0_30px_60px_-30px_rgb(9_14_38/0.5)] ${copy.tone}`}
            >
              <div
                aria-hidden
                className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-white/20 blur-3xl"
              />
              <div className="relative">
                <span
                  className="glass-dark flex size-14 items-center justify-center rounded-2xl"
                  data-verdict-icon
                >
                  <copy.icon className="size-7" aria-hidden />
                </span>
                <h2
                  className="mt-5 text-3xl font-semibold leading-tight tracking-tight"
                  data-verdict-item
                >
                  {copy.title}
                </h2>
                <p className="mt-2 text-sm opacity-85" data-verdict-item>
                  {verdict.kind === "valid"
                    ? `This scale was verified by a Legal Metrology Officer and is valid until ${verdict.instrument.validTill}.`
                    : verdict.kind === "expiring"
                      ? `Stamping lapses on ${verdict.instrument.validTill}. Readings are still legally valid today.`
                      : verdict.kind === "unknown"
                        ? "No stamping record exists for this sticker. Treat it as counterfeit and do not rely on the reading."
                        : "Stamping on this scale is not valid. The trader must get it re-verified before using it."}
                </p>

                {verdict.instrument ? (
                  <dl className="num mt-5 grid grid-cols-2 gap-2 text-xs">
                    {[
                      ["Instrument", verdict.instrument.id],
                      ["Type", verdict.instrument.name],
                      ["Last stamped", verdict.instrument.stampedOn],
                      ["Valid till", verdict.instrument.validTill],
                    ].map(([label, value]) => (
                      <div
                        className="rounded-2xl bg-black/10 px-3 py-2.5"
                        data-verdict-item
                        key={label}
                      >
                        <dt className="text-[10px] uppercase tracking-[0.1em] opacity-70">
                          {label}
                        </dt>
                        <dd className="mt-0.5 truncate font-semibold">
                          {value}
                        </dd>
                      </div>
                    ))}
                  </dl>
                ) : (
                  <p className="num mt-5 break-all rounded-2xl bg-black/15 px-3 py-2.5 font-mono text-xs">
                    Payload: {verdict.code || "could not be read"}
                  </p>
                )}

                <div className="mt-5 flex flex-wrap gap-2" data-verdict-item>
                  {verdict.instrument ? (
                    <Link
                      className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-semibold text-navy-900 transition-transform hover:-translate-y-0.5"
                      href={`/verify/${encodeURIComponent(recordId ?? "")}`}
                    >
                      Full record
                      <ArrowRight className="size-3.5" aria-hidden />
                    </Link>
                  ) : null}
                  {verdict.kind === "valid" ? null : (
                    <Link
                      className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-4 py-2 text-xs font-semibold transition-colors hover:bg-black/30"
                      href={`/report-fraud${verdict.instrument ? `?scale=${verdict.instrument.id}` : ""}`}
                    >
                      <FlagTriangleRight className="size-3.5" aria-hidden />
                      Report this scale
                    </Link>
                  )}
                  {verdict.kind === "invalid" ? (
                    <Link
                      className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-4 py-2 text-xs font-semibold transition-colors hover:bg-black/30"
                      href="/camps"
                    >
                      <Truck className="size-3.5" aria-hidden />
                      Nearest camp
                    </Link>
                  ) : null}
                  <button
                    className="inline-flex items-center gap-1.5 rounded-full bg-black/20 px-4 py-2 text-xs font-semibold transition-colors hover:bg-black/30"
                    onClick={clear}
                    type="button"
                  >
                    <RotateCcw className="size-3.5" aria-hidden />
                    Scan another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass flex flex-1 flex-col items-center justify-center rounded-4xl p-8 text-center">
              <ConsumerArt className="h-36 w-auto" />
              <h2 className="mt-4 text-xl font-semibold text-ink">
                Waiting for a sticker
              </h2>
              <p className="mt-2 max-w-xs text-sm leading-6 text-ink-muted">
                Every legally stamped scale carries a QR seal. Scan it before
                you pay to see who verified it and until when.
              </p>
            </div>
          )}
        </div>

        <div className="glass rounded-4xl p-5">
          <p className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.12em] text-ink-muted">
            <History className="size-3.5" aria-hidden />
            Your scans this session
          </p>
          {log.length ? (
            <ul className="mt-3 space-y-1.5 text-xs">
              {log.map((entry) => (
                <li
                  className="flex items-center gap-3 rounded-2xl bg-white/50 px-3 py-2.5"
                  key={entry.id}
                >
                  <span
                    className={`size-2 shrink-0 rounded-full ${logDot[entry.kind]}`}
                  />
                  <span className="flex-1 truncate text-ink">
                    {entry.label}
                  </span>
                  <span className="num shrink-0 text-ink-muted">
                    {entry.time}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-ink-muted">
              Nothing scanned yet. Results stay on this device only.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
