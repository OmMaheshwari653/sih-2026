"use client";

import { ArrowRight, FileWarning, ScanLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { CounterScene } from "@/components/home/CounterScene";
import { LookupBar } from "@/components/public/LookupBar";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

const WORDS = ["scale.", "fuel pump.", "gold balance.", "milk meter."];

const stats = [
  { value: "1.42 Cr", label: "instruments stamped digitally" },
  { value: "24,915", label: "officers on the network" },
  { value: "38,204", label: "fraud reports actioned" },
  { value: "100%", label: "paperless stamping" },
];

/** Hand-drawn underline under the rotating word. */
const Squiggle = () => (
  <svg
    aria-hidden="true"
    className="absolute -bottom-2 left-0 h-3.5 w-full overflow-visible sm:-bottom-3 sm:h-5"
    fill="none"
    preserveAspectRatio="none"
    viewBox="0 0 300 20"
  >
    <path
      d="M3 14C40 6 70 5 104 10s64 7 96 1 70-8 97 2"
      data-squiggle
      stroke="#ff9a3c"
      strokeLinecap="round"
      strokeWidth="6"
      vectorEffect="non-scaling-stroke"
    />
  </svg>
);

export const Hero = () => {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) {
        return;
      }
      const q = gsap.utils.selector(el);
      const introPending =
        document.documentElement.classList.contains("intro-pending");
      const start = introPending ? 1.9 : 0.1;

      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        /* ---------------------------------------------- Entrance */
        const lines = q<HTMLElement>("[data-hero-line]");
        const split = SplitText.create(q("[data-hero-sub]"), {
          type: "lines",
          mask: "lines",
        });

        gsap
          .timeline({ delay: start, defaults: { ease: "expo.out" } })
          .from(q("[data-hero-meta]"), { y: 16, opacity: 0, duration: 0.8 })
          .from(
            lines,
            { yPercent: 115, rotate: 4, duration: 1.2, stagger: 0.12 },
            0.1,
          )
          .from(
            q("[data-squiggle]"),
            { drawSVG: 0, duration: 0.9, ease: "power2.inOut" },
            0.8,
          )
          .from(split.lines, { yPercent: 100, duration: 1, stagger: 0.06 }, 0.5)
          .from(
            q("[data-hero-cta] > *"),
            { y: 24, opacity: 0, duration: 0.9, stagger: 0.08 },
            0.7,
          )
          .from(
            q("[data-hero-lookup]"),
            { y: 24, opacity: 0, duration: 0.9 },
            0.85,
          )
          .fromTo(
            q("[data-hero-stage]"),
            { clipPath: "inset(100% 0% 0% 0% round 2.5rem)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 2.5rem)",
              duration: 1.3,
              ease: "expo.inOut",
            },
            0.15,
          )
          .from(
            q("[data-hero-scene]"),
            { yPercent: 18, scale: 0.9, duration: 1.4 },
            0.45,
          )
          .from(
            q("[data-hero-stat]"),
            { y: 30, opacity: 0, duration: 0.9, stagger: 0.07 },
            0.9,
          );

        /* ------------------------------------------- Word rotator */
        const slot = el.querySelector<HTMLElement>("[data-rotator]");
        const words = q<HTMLElement>("[data-word]");
        if (slot && words.length > 1) {
          gsap.set(words.slice(1), { yPercent: 110, opacity: 0 });
          gsap.set(slot, { width: words[0].offsetWidth });

          const cycle = gsap.timeline({
            delay: start + 2.4,
            repeat: -1,
          });
          words.forEach((word, index) => {
            const next = words[(index + 1) % words.length];
            cycle
              .to({}, { duration: 1.9 })
              .to(word, {
                yPercent: -110,
                opacity: 0,
                rotate: -6,
                duration: 0.45,
                ease: "power3.in",
              })
              .to(
                slot,
                {
                  width: () => next.offsetWidth,
                  duration: 0.7,
                  ease: "expo.inOut",
                },
                "<0.2",
              )
              .fromTo(
                next,
                { yPercent: 110, opacity: 0, rotate: 6 },
                {
                  yPercent: 0,
                  opacity: 1,
                  rotate: 0,
                  duration: 0.8,
                  ease: "expo.out",
                  immediateRender: false,
                },
                "<0.35",
              )
              .fromTo(
                q("[data-squiggle]"),
                { drawSVG: "0% 0%" },
                { drawSVG: "0% 100%", duration: 0.7, ease: "power2.inOut" },
                "<0.1",
              );
          });
        }

        /* -------------------------------------- Scroll-away depth */
        gsap.to(q("[data-hero-stage]"), {
          yPercent: 8,
          scale: 0.96,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
        gsap.to(q("[data-hero-copy]"), {
          yPercent: -12,
          opacity: 0.3,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section
      className="relative mx-auto w-full max-w-360 px-4 pb-10 pt-8 sm:px-6 lg:pt-12"
      data-motion-manual
      ref={root}
    >
      <div className="grid items-center gap-10 lg:grid-cols-[1.02fr_1fr] lg:gap-12">
        {/* ----------------------------------------------------- Copy */}
        <div data-hero-copy>
          <div
            className="flex flex-wrap items-center gap-3 text-xs text-ink-muted"
            data-hero-meta
          >
            <Image
              alt="Department of Consumer Affairs, Government of India"
              className="h-8 w-auto mix-blend-multiply"
              height={279}
              preload
              src="/ministry.png"
              width={830}
            />
            <span className="hidden h-6 w-px bg-line sm:block" />
            <span className="flex items-center gap-2">
              <span className="relative flex size-2">
                <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/60" />
                <span className="relative size-2 rounded-full bg-emerald-500" />
              </span>
              Legal Metrology Act, 2009 · Public verification
            </span>
          </div>

          <h1 className="mt-8 text-[clamp(2.9rem,6.4vw,6rem)] font-semibold leading-[0.95] tracking-[-0.05em] text-ink">
            <span className="block overflow-hidden pb-[0.08em]">
              <span className="block" data-hero-line>
                Before you pay,
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.18em]">
              <span className="block" data-hero-line>
                check the{" "}
                <span className="relative inline-block align-bottom">
                  <span
                    className="relative inline-flex h-[1.12em] overflow-hidden align-bottom"
                    data-rotator
                  >
                    {WORDS.map((word, index) => (
                      <span
                        className={`font-display whitespace-nowrap pr-[0.06em] font-normal italic tracking-[-0.02em] text-navy-500 ${index === 0 ? "relative" : "absolute left-0 top-0"}`}
                        data-word
                        key={word}
                      >
                        {word}
                      </span>
                    ))}
                  </span>
                  <Squiggle />
                </span>
              </span>
            </span>
          </h1>

          <p
            className="mt-7 max-w-xl text-base leading-7 text-ink-muted sm:text-lg sm:leading-8"
            data-hero-sub
          >
            Every instrument stamped by a Legal Metrology Officer carries a QR
            seal. Scan it to see who verified it and until when — no login, no
            app.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3" data-hero-cta>
            <Link
              className="group btn-ink inline-flex items-center gap-3 rounded-full py-2 pl-5 pr-2 text-sm font-semibold"
              data-magnetic="0.2"
              href="/verify"
            >
              <ScanLine className="size-4" aria-hidden />
              Scan a scale
              <span className="relative flex size-9 items-center justify-center overflow-hidden rounded-full bg-white text-ink">
                <ArrowRight
                  className="size-4 transition-transform duration-500 ease-glass group-hover:translate-x-7"
                  aria-hidden
                />
                <ArrowRight
                  className="absolute size-4 -translate-x-7 transition-transform duration-500 ease-glass group-hover:translate-x-0"
                  aria-hidden
                />
              </span>
            </Link>
            <Link
              className="group relative inline-flex items-center gap-2 px-2 py-2 text-sm font-semibold text-ink"
              href="/report-fraud"
            >
              <FileWarning className="size-4 text-red-600" aria-hidden />
              Report under-weighing
              <span className="absolute inset-x-2 bottom-1 h-px origin-right scale-x-0 bg-ink transition-transform duration-500 ease-glass group-hover:origin-left group-hover:scale-x-100" />
            </Link>
          </div>

          <div className="mt-8 max-w-xl" data-hero-lookup>
            <LookupBar />
          </div>
        </div>

        {/* ---------------------------------------------------- Stage */}
        <div
          className="relative aspect-[600/560] w-full overflow-hidden rounded-[2.5rem] bg-[#fbf1e1] shadow-[inset_0_0_0_1px_rgb(18_26_62/0.06),0_40px_80px_-40px_rgb(120_72_20/0.35)]"
          data-hero-stage
        >
          <div
            aria-hidden
            className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgb(18_26_62/0.05)_1px,transparent_1px),linear-gradient(90deg,rgb(18_26_62/0.05)_1px,transparent_1px)] [background-size:44px_44px]"
          />
          <div
            aria-hidden
            className="absolute -right-24 -top-24 size-80 rounded-full bg-[#ffd9a8] blur-3xl"
          />
          <div className="absolute inset-x-4 bottom-0 top-8" data-hero-scene>
            <CounterScene startDelay={introDelay()} />
          </div>
          <p className="absolute left-6 top-5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-ink-muted backdrop-blur">
            ABC Traders · Civil Lines, Prayagraj
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------ Stats */}
      <dl className="mt-14 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8 lg:grid-cols-4">
        {stats.map((stat) => (
          <div data-hero-stat key={stat.label}>
            <dd
              className="num text-4xl font-semibold tracking-[-0.04em] text-ink sm:text-5xl"
              data-count
            >
              {stat.value}
            </dd>
            <dt className="mt-1 text-sm text-ink-muted">{stat.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
};

/** The scene's story should wait for the first-visit intro to lift. */
const introDelay = () =>
  typeof document !== "undefined" &&
  document.documentElement.classList.contains("intro-pending")
    ? 1.9
    : 0;
