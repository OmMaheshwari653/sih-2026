"use client";

import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  ScanLine,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";

const DUMMY_CERTIFICATE_ID = "LM-UP-PRY-000123";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraError, setCameraError] = useState(false);
  const [scanning, setScanning] = useState(true);

  useEffect(() => {
    let mounted = true;
    let redirectTimer: ReturnType<typeof setTimeout> | null = null;

    const stopCamera = () => {
      if (redirectTimer) {
        clearTimeout(redirectTimer);
        redirectTimer = null;
      }

      streamRef.current?.getTracks().forEach((track) => {
        track.stop();
      });

      streamRef.current = null;
    };

    const startCamera = async () => {
      try {
        setCameraError(false);

        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("Camera API is not supported");
        }

        const stream =
          await navigator.mediaDevices.getUserMedia({
            video: {
              facingMode: {
                ideal: "environment",
              },
              width: {
                ideal: 1280,
              },
              height: {
                ideal: 720,
              },
            },
            audio: false,
          });

        if (!mounted) {
          stream.getTracks().forEach((track) => {
            track.stop();
          });

          return;
        }

        streamRef.current = stream;

        const video = videoRef.current;

        if (!video) {
          stopCamera();
          return;
        }

        video.srcObject = stream;
        await video.play();

        /*
         * Temporary demo flow:
         * The camera is only being used as a visual scanner.
         * After a short scan animation, the dummy certificate
         * is opened.
         */
        redirectTimer = setTimeout(() => {
          if (!mounted) return;

          setScanning(false);
          stopCamera();

          window.location.href =
            `/verify/${DUMMY_CERTIFICATE_ID}`;
        }, 2000);
      } catch (error) {
        console.error("Camera error:", error);

        if (mounted) {
          setCameraError(true);
          setScanning(false);
        }
      }
    };

    startCamera();

    return () => {
      mounted = false;
      stopCamera();
    };
  }, []);

  const handleExit = () => {
    stopCameraForExit();
    window.location.href = "/";
  };

  const stopCameraForExit = () => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });

    streamRef.current = null;
  };

  return (
    <main className="min-h-screen bg-surface px-3 py-3 text-ink sm:px-5 sm:py-5 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Top bar */}
        <header className="mb-4 flex items-center justify-between gap-3 sm:mb-5">
          <button
            type="button"
            onClick={handleExit}
            className="inline-flex min-h-10 items-center gap-2 rounded-gov border border-line bg-white px-3 py-2 text-xs font-semibold text-ink shadow-sm transition hover:bg-surface-alt focus:outline-none focus:ring-2 focus:ring-navy-300 sm:px-4 sm:text-sm"
            aria-label="Exit scanner"
          >
            <ArrowLeft
              className="size-4"
              aria-hidden
            />
            <span>Exit</span>
          </button>

          <div className="flex items-center gap-2 rounded-gov border border-line bg-white px-3 py-2 shadow-sm">
            <ShieldCheck
              className="size-4 text-india-green sm:size-5"
              aria-hidden
            />

            <span className="hidden text-xs font-semibold text-ink sm:inline">
              Public Certificate Verification
            </span>

            <span className="text-xs font-semibold text-ink sm:hidden">
              Verification
            </span>
          </div>
        </header>

        {/* Page heading */}
        <section className="mb-4 rounded-gov border border-line bg-white p-4 shadow-sm sm:mb-5 sm:p-5">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-gov bg-navy text-saffron sm:size-11">
              <ScanLine
                className="size-5 sm:size-6"
                aria-hidden
              />
            </div>

            <div className="min-w-0">
              <h1 className="font-serif text-xl font-bold text-ink sm:text-2xl">
                Scan QR Code
              </h1>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-ink-muted sm:text-sm">
                Scan the QR code displayed on the weighing or
                measuring instrument to view its public
                verification certificate.
              </p>
            </div>
          </div>
        </section>

        {/* Scanner */}
        <section className="overflow-hidden rounded-gov border border-line bg-navy shadow-lg">
          {/* Scanner header */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-3 sm:px-5">
            <div>
              <p className="text-xs font-semibold text-white sm:text-sm">
                Camera scanner
              </p>

              <p className="mt-0.5 text-[11px] text-white/55 sm:text-xs">
                Position the QR code inside the frame
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-2.5 py-1.5">
              <span
                className={`size-2 rounded-full ${
                  cameraError
                    ? "bg-red-400"
                    : scanning
                      ? "animate-pulse bg-saffron"
                      : "bg-india-green"
                }`}
              />

              <span className="text-[10px] font-semibold text-white/80 sm:text-xs">
                {cameraError
                  ? "Camera unavailable"
                  : scanning
                    ? "Scanning"
                    : "Verified"}
              </span>
            </div>
          </div>

          {/* Camera viewport */}
          <div className="relative aspect-[4/3] w-full bg-black sm:aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="size-full object-cover"
            />

            {/* Dark overlay */}
            {!cameraError && (
              <div className="pointer-events-none absolute inset-0 bg-black/10" />
            )}

            {/* Scanner frame */}
            {!cameraError && (
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center p-6 sm:p-10">
                <div className="relative aspect-square w-[min(72vw,360px)] max-w-[78%]">
                  {/* subtle frame */}
                  <div className="absolute inset-0 rounded-xl border border-white/20" />

                  {/* top-left */}
                  <span className="absolute left-0 top-0 h-10 w-10 rounded-tl-xl border-l-[3px] border-t-[3px] border-saffron sm:h-14 sm:w-14 sm:border-l-4 sm:border-t-4" />

                  {/* top-right */}
                  <span className="absolute right-0 top-0 h-10 w-10 rounded-tr-xl border-r-[3px] border-t-[3px] border-saffron sm:h-14 sm:w-14 sm:border-r-4 sm:border-t-4" />

                  {/* bottom-left */}
                  <span className="absolute bottom-0 left-0 h-10 w-10 rounded-bl-xl border-b-[3px] border-l-[3px] border-saffron sm:h-14 sm:w-14 sm:border-b-4 sm:border-l-4" />

                  {/* bottom-right */}
                  <span className="absolute bottom-0 right-0 h-10 w-10 rounded-br-xl border-b-[3px] border-r-[3px] border-saffron sm:h-14 sm:w-14 sm:border-b-4 sm:border-r-4" />

                  {/* scanning line */}
                  {scanning && (
                    <div className="absolute left-2 right-2 top-1/2 h-px animate-pulse bg-saffron shadow-[0_0_12px_rgba(255,165,0,0.9)]" />
                  )}
                </div>
              </div>
            )}

            {/* Camera error */}
            {cameraError && (
              <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
                <div className="max-w-sm">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/10">
                    <Camera
                      className="size-6 text-saffron"
                      aria-hidden
                    />
                  </div>

                  <h2 className="mt-3 text-sm font-semibold text-white sm:text-base">
                    Camera access required
                  </h2>

                  <p className="mt-1.5 text-xs leading-5 text-white/60 sm:text-sm">
                    Please allow camera access in your
                    browser and reopen the scanner.
                  </p>
                </div>
              </div>
            )}

            {/* Bottom scanner status */}
            {!cameraError && (
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-4 pb-4 pt-10 sm:px-5 sm:pb-5">
                <div className="flex items-center justify-center gap-2 text-center">
                  {scanning ? (
                    <>
                      <ScanLine
                        className="size-4 text-saffron"
                        aria-hidden
                      />

                      <span className="text-xs font-medium text-white sm:text-sm">
                        Scanning for instrument certificate…
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2
                        className="size-4 text-india-green"
                        aria-hidden
                      />

                      <span className="text-xs font-medium text-white sm:text-sm">
                        Verification successful
                      </span>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Info cards */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-gov border border-line bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <ScanLine
                className="mt-0.5 size-4 shrink-0 text-navy-500"
                aria-hidden
              />

              <div>
                <p className="text-xs font-semibold text-ink sm:text-sm">
                  How to scan
                </p>

                <p className="mt-1 text-[11px] leading-5 text-ink-muted sm:text-xs">
                  Keep the QR code steady and clearly visible
                  inside the highlighted frame.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-gov border border-line bg-white p-4 shadow-sm">
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-0.5 size-4 shrink-0 text-india-green"
                aria-hidden
              />

              <div>
                <p className="text-xs font-semibold text-ink sm:text-sm">
                  Public verification
                </p>

                <p className="mt-1 text-[11px] leading-5 text-ink-muted sm:text-xs">
                  The certificate contains the public
                  verification details of the instrument.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer note */}
        <p className="mt-4 pb-3 text-center text-[10px] leading-4 text-ink-muted sm:text-xs">
          Government verification service · Public access
        </p>
      </div>
    </main>
  );
}