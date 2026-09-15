"use client";

import { usePathname } from "next/navigation";
import { type ReactNode, useRef } from "react";
import { gsap, ScrollTrigger, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Declarative motion for the whole app. Server-rendered markup opts in with
 * data attributes and this scope wires them up after every navigation:
 *
 * - `data-reveal`            fade/rise in when scrolled into view (batched)
 * - `data-split="hero"`      headline characters roll up on load
 * - `data-split="lines"`     lines slide up from a mask on scroll
 * - `data-scrub-words`       words brighten as the paragraph scrolls past
 * - `data-count`             numbers count up from zero when visible
 * - `data-parallax="0.2"`    drifts against scroll
 * - `data-hero-shrink`       hero card eases back as the page scrolls
 * - `data-hscroll`           pinned horizontal track (desktop)
 * - `data-draw`              SVG strokes draw on when visible
 * - `data-tilt`              3D tilt + pointer spotlight
 * - `data-magnetic`          pulls toward the pointer
 * - `data-scroll-progress`   reading progress bar
 *
 * Top-level glass panels inside `#main` also rise in on each route, so every
 * portal page gets entrance motion without per-page code.
 */
export const MotionScope = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const html = document.documentElement;
      const main = document.getElementById("main");
      if (main) {
        gsap.set(main, { autoAlpha: 1 });
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          motion: "(prefers-reduced-motion: no-preference)",
          desktop: "(min-width: 1024px)",
          fine: "(pointer: fine)",
        },
        (context) => {
          const { motion, desktop, fine } = context.conditions as {
            motion: boolean;
            desktop: boolean;
            fine: boolean;
          };
          if (!motion) {
            return;
          }

          const q = gsap.utils.selector(document);

          /* ---------------------------------------------- Hero headline */
          for (const el of q<HTMLElement>("[data-split='hero']")) {
            const split = SplitText.create(el, {
              type: "lines,words,chars",
              mask: "lines",
              linesClass: "split-line",
            });
            gsap.from(split.chars, {
              yPercent: 110,
              rotate: 8,
              opacity: 0,
              duration: 1.1,
              ease: "expo.out",
              stagger: 0.022,
              delay: html.classList.contains("intro-pending") ? 1.9 : 0.15,
            });
          }

          /* ---------------------------------------- Line reveals on scroll */
          for (const el of q<HTMLElement>("[data-split='lines']")) {
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              autoSplit: true,
              onSplit: (self) =>
                gsap.from(self.lines, {
                  yPercent: 105,
                  duration: 1,
                  ease: "expo.out",
                  stagger: 0.08,
                  scrollTrigger: { trigger: el, start: "top 85%", once: true },
                }),
            });
          }

          /* ----------------------------------------- Scrubbed word colour */
          for (const el of q<HTMLElement>("[data-scrub-words]")) {
            const split = SplitText.create(el, { type: "words" });
            gsap.fromTo(
              split.words,
              { opacity: 0.12 },
              {
                opacity: 1,
                ease: "none",
                stagger: 0.1,
                scrollTrigger: {
                  trigger: el,
                  start: "top 80%",
                  end: "bottom 45%",
                  scrub: true,
                },
              },
            );
          }

          /* ---------------------------------------------------- Reveals */
          const auto = q<HTMLElement>("#main .glass").filter(
            (el) =>
              !el.parentElement?.closest(
                ".glass, [data-reveal], [data-motion-manual]",
              ) && !el.closest("[data-motion-manual]"),
          );
          const revealTargets = [
            ...new Set([...q<HTMLElement>("[data-reveal]"), ...auto]),
          ].filter((el) => !el.closest("[data-motion-manual] [data-reveal]"));

          gsap.set(revealTargets, { opacity: 0, y: 40, scale: 0.98 });
          ScrollTrigger.batch(revealTargets, {
            start: "top 92%",
            once: true,
            onEnter: (batch) =>
              gsap.to(batch, {
                opacity: 1,
                y: 0,
                scale: 1,
                duration: 1,
                ease: "expo.out",
                stagger: 0.08,
                overwrite: true,
                // Transforms create containing blocks that break sticky children.
                clearProps: "transform,opacity",
              }),
          });

          /* ----------------------------------------------------- Counters */
          for (const el of q<HTMLElement>("[data-count]")) {
            // Keep the server-rendered value: a re-run must not read a mid-count "0".
            const original = el.dataset.countOriginal ?? el.textContent ?? "";
            el.dataset.countOriginal = original;
            const match = original.match(/[\d,]*\.?\d+/);
            if (!match) {
              continue;
            }
            const raw = match[0];
            const target = Number.parseFloat(raw.replace(/,/g, ""));
            const decimals = raw.includes(".") ? raw.split(".")[1].length : 0;
            const grouped = raw.includes(",");
            const [before, after] = [
              original.slice(0, match.index),
              original.slice((match.index ?? 0) + raw.length),
            ];
            const state = { value: 0 };
            const render = () => {
              const fixed = state.value.toFixed(decimals);
              const text = grouped
                ? Number(fixed).toLocaleString("en-IN", {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals,
                  })
                : fixed;
              el.textContent = `${before}${text}${after}`;
            };
            render();
            gsap.to(state, {
              value: target,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: render,
              onComplete: () => {
                el.textContent = original;
              },
              scrollTrigger: { trigger: el, start: "top 95%", once: true },
            });
          }

          /* ---------------------------------------------------- Parallax */
          for (const el of q<HTMLElement>("[data-parallax]")) {
            const speed = Number(el.dataset.parallax) || 0.15;
            gsap.to(el, {
              yPercent: -100 * speed,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top bottom",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          /* ------------------------------------------------ Hero shrink */
          for (const el of q<HTMLElement>("[data-hero-shrink]")) {
            gsap.to(el, {
              scale: 0.94,
              borderRadius: 48,
              opacity: 0.6,
              ease: "none",
              scrollTrigger: {
                trigger: el,
                start: "top top",
                end: "bottom top",
                scrub: true,
              },
            });
          }

          /* ------------------------------------------------ SVG drawing */
          for (const el of q<SVGElement>("[data-draw]")) {
            const strokes = el.matches("path, line, circle, rect, polyline")
              ? [el]
              : el.querySelectorAll("path, line, circle, rect, polyline");
            gsap.from(strokes, {
              drawSVG: 0,
              duration: 1.4,
              ease: "power2.inOut",
              stagger: 0.08,
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
            });
          }

          /* ------------------------------------------- Scroll progress */
          for (const el of q<HTMLElement>("[data-scroll-progress]")) {
            gsap.fromTo(
              el,
              { scaleX: 0 },
              {
                scaleX: 1,
                ease: "none",
                scrollTrigger: {
                  start: 0,
                  end: "max",
                  scrub: 0.3,
                },
              },
            );
          }

          /* --------------------------------- Pinned horizontal track */
          if (desktop) {
            for (const section of q<HTMLElement>("[data-hscroll]")) {
              const track = section.querySelector<HTMLElement>(
                "[data-hscroll-track]",
              );
              const bar =
                section.querySelector<HTMLElement>("[data-hscroll-bar]");
              if (!track) {
                continue;
              }
              const distance = () =>
                Math.max(0, track.scrollWidth - section.clientWidth + 48);
              const tween = gsap.to(track, {
                x: () => -distance(),
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 12%",
                  end: () => `+=${distance()}`,
                  scrub: 0.6,
                  pin: true,
                  anticipatePin: 1,
                  invalidateOnRefresh: true,
                },
              });
              if (bar) {
                gsap.fromTo(
                  bar,
                  { scaleX: 0 },
                  {
                    scaleX: 1,
                    ease: "none",
                    scrollTrigger: {
                      trigger: section,
                      start: "top 12%",
                      end: () => `+=${distance()}`,
                      scrub: 0.6,
                    },
                  },
                );
              }
              for (const card of track.children) {
                gsap.from(card, {
                  opacity: 0.35,
                  scale: 0.92,
                  rotate: 2,
                  ease: "none",
                  scrollTrigger: {
                    trigger: card,
                    containerAnimation: tween,
                    start: "left 95%",
                    end: "left 55%",
                    scrub: true,
                  },
                });
              }
            }
          }

          /* ------------------------------------- Pointer interactions */
          if (!fine) {
            return;
          }
          const cleanups: (() => void)[] = [];

          for (const el of q<HTMLElement>("[data-tilt]")) {
            const strength = Number(el.dataset.tilt) || 8;
            gsap.set(el, { transformPerspective: 900 });
            const rotX = gsap.quickTo(el, "rotationX", {
              duration: 0.6,
              ease: "power3",
            });
            const rotY = gsap.quickTo(el, "rotationY", {
              duration: 0.6,
              ease: "power3",
            });
            const move = (event: PointerEvent) => {
              const rect = el.getBoundingClientRect();
              const px = (event.clientX - rect.left) / rect.width;
              const py = (event.clientY - rect.top) / rect.height;
              rotY((px - 0.5) * strength);
              rotX((0.5 - py) * strength);
              el.style.setProperty("--mx", `${px * 100}%`);
              el.style.setProperty("--my", `${py * 100}%`);
            };
            const leave = () => {
              rotX(0);
              rotY(0);
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            });
          }

          for (const el of q<HTMLElement>("[data-magnetic]")) {
            const strength = Number(el.dataset.magnetic) || 0.35;
            const x = gsap.quickTo(el, "x", {
              duration: 0.5,
              ease: "elastic.out(1, 0.4)",
            });
            const y = gsap.quickTo(el, "y", {
              duration: 0.5,
              ease: "elastic.out(1, 0.4)",
            });
            const move = (event: PointerEvent) => {
              const rect = el.getBoundingClientRect();
              x((event.clientX - rect.left - rect.width / 2) * strength);
              y((event.clientY - rect.top - rect.height / 2) * strength);
            };
            const leave = () => {
              x(0);
              y(0);
            };
            el.addEventListener("pointermove", move);
            el.addEventListener("pointerleave", leave);
            cleanups.push(() => {
              el.removeEventListener("pointermove", move);
              el.removeEventListener("pointerleave", leave);
            });
          }

          return () => {
            for (const cleanup of cleanups) {
              cleanup();
            }
          };
        },
      );

      // Fonts and images shift layout after first paint.
      const refresh = () => ScrollTrigger.refresh();
      document.fonts?.ready.then(refresh);
      window.addEventListener("load", refresh, { once: true });

      return () => {
        window.removeEventListener("load", refresh);
      };
    },
    { dependencies: [pathname], revertOnUpdate: true, scope: root },
  );

  return (
    <div className="contents" ref={root}>
      {children}
    </div>
  );
};
