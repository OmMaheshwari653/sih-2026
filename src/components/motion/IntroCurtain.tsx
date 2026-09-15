"use client";

import { useRef } from "react";
import { LogoMark } from "@/components/brand/Logo";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

import { INTRO_KEY } from "@/lib/motion-keys";

/**
 * First-visit intro: the mark draws itself, the wordmark rolls in, a counter
 * runs to 100 and the curtain lifts. The `intro-pending` class is set by an
 * inline script before paint, so returning visitors never see a flash of it.
 */
export const IntroCurtain = () => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const el = root.current;
      if (!el || !html.classList.contains("intro-pending")) {
        return;
      }

      const finish = () => {
        html.classList.remove("intro-pending");
        try {
          sessionStorage.setItem(INTRO_KEY, "1");
        } catch {
          // Storage blocked — the intro simply plays again next time.
        }
      };

      const word = el.querySelector<HTMLElement>("[data-intro-word]");
      const counter = el.querySelector<HTMLElement>("[data-intro-count]");
      const split = word
        ? SplitText.create(word, { type: "chars", mask: "chars" })
        : null;
      const state = { value: 0 };

      gsap
        .timeline({ onComplete: finish })
        .from(el.querySelectorAll("[data-logo-stroke]"), {
          drawSVG: 0,
          duration: 0.9,
          ease: "power2.inOut",
          stagger: 0.05,
        })
        .from(
          el.querySelector("[data-intro-mark]"),
          {
            scale: 0.6,
            rotate: -20,
            duration: 1,
            ease: "elastic.out(1, 0.55)",
          },
          0,
        )
        .from(
          split?.chars ?? [],
          { yPercent: 100, duration: 0.7, ease: "expo.out", stagger: 0.025 },
          0.35,
        )
        .to(
          state,
          {
            value: 100,
            duration: 1.3,
            ease: "power2.inOut",
            onUpdate: () => {
              if (counter) {
                counter.textContent = String(Math.round(state.value)).padStart(
                  3,
                  "0",
                );
              }
            },
          },
          0,
        )
        .to(el.querySelector("[data-intro-inner]"), {
          y: -40,
          opacity: 0,
          duration: 0.45,
          ease: "power2.in",
        })
        .to(
          el,
          {
            clipPath: "inset(0% 0% 100% 0%)",
            duration: 0.9,
            ease: "expo.inOut",
          },
          "-=0.15",
        );
    },
    { scope: root },
  );

  return (
    <div
      aria-hidden
      className="intro-curtain aurora-dark fixed inset-0 z-100 items-center justify-center text-white"
      data-intro
      ref={root}
    >
      <div className="flex flex-col items-center" data-intro-inner>
        <div data-intro-mark>
          <LogoMark className="size-20 drop-shadow-[0_20px_40px_rgb(79_107_255/0.5)]" />
        </div>
        <p
          className="mt-6 text-3xl font-semibold tracking-tight sm:text-4xl"
          data-intro-word
        >
          Legal Metrology
        </p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-white/50">
          Online Verification System
        </p>
      </div>
      <p
        className="num absolute bottom-8 right-8 font-mono text-sm text-white/50"
        data-intro-count
      >
        000
      </p>
      <span className="tricolor-rule absolute bottom-0 left-0 h-1 w-full" />
    </div>
  );
};
