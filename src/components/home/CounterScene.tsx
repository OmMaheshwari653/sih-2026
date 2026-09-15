"use client";

import { animate, stagger } from "animejs";
import { useEffect, useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const INK = "#121a3e";

/** Tomatoes resting on the pan: [cx, cy, weight shown after it lands]. */
const TOMATOES: [number, number, string][] = [
  [196, 236, "0.310"],
  [248, 238, "0.640"],
  [300, 236, "0.955"],
  [222, 196, "1.250"],
];

/** Fixed sticker pattern so server and client render identically. */
const STICKER_CELLS = [
  0, 1, 2, 4, 5, 6, 8, 11, 12, 13, 15, 17, 19, 20, 22, 23, 25, 28, 29, 30, 32,
  34, 35,
];

const Tomato = ({ cx, cy }: { cx: number; cy: number }) => (
  <g>
    <circle
      cx={cx}
      cy={cy}
      fill="#e5402f"
      r="24"
      stroke={INK}
      strokeWidth="3"
    />
    <path
      d={`M${cx - 12} ${cy - 8}a14 14 0 0 1 10-10`}
      stroke="#fff"
      strokeLinecap="round"
      strokeOpacity=".55"
      strokeWidth="4"
    />
    <path
      d={`M${cx} ${cy - 24}l-7-6m7 6l7-6m-7 6v-9`}
      stroke="#1f8a3b"
      strokeLinecap="round"
      strokeWidth="3.5"
    />
  </g>
);

/**
 * A kirana counter that plays out the whole promise of the portal: produce is
 * weighed, a customer's phone reads the QR seal on the scale, and the stamp
 * comes back verified. GSAP runs the story; anime.js handles the ambient bits.
 */
export const CounterScene = ({ startDelay = 0 }: { startDelay?: number }) => {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = root.current;
      if (!el) {
        return;
      }
      const q = gsap.utils.selector(el);
      const led = el.querySelector<SVGTextElement>("[data-led]");
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const reading = { value: 0 };
        const renderLed = () => {
          if (led) {
            led.textContent = reading.value.toFixed(3);
          }
        };

        const reset = () => {
          reading.value = 0;
          renderLed();
          gsap.set(q("[data-tomato]"), { y: -320, opacity: 0, rotate: -30 });
          gsap.set(q("[data-phone]"), { x: 240, rotate: 14, opacity: 0 });
          gsap.set(q("[data-cone], [data-verdict], [data-sticker-glow]"), {
            opacity: 0,
          });
          gsap.set(q("[data-toast]"), { scale: 0, opacity: 0 });
          gsap.set(q("[data-beam]"), { y: 0, opacity: 0 });
        };
        reset();

        const story = gsap.timeline({
          delay: startDelay + 0.9,
          repeat: -1,
          repeatDelay: 0.6,
          onRepeat: reset,
          defaults: { ease: "power3.out" },
        });

        q<SVGGElement>("[data-tomato]").forEach((tomato, index) => {
          const [, , weight] = TOMATOES[index];
          story
            .to(tomato, {
              y: 0,
              rotate: 0,
              opacity: 1,
              duration: 0.85,
              ease: "bounce.out",
            })
            .to(
              q("[data-pan]"),
              {
                y: 5,
                duration: 0.12,
                yoyo: true,
                repeat: 1,
                ease: "power1.inOut",
              },
              "-=0.55",
            )
            .to(
              reading,
              {
                value: Number(weight),
                duration: 0.6,
                ease: "power2.out",
                onUpdate: renderLed,
              },
              "<",
            )
            .to({}, { duration: 0.15 });
        });

        story
          .to(q("[data-led]"), {
            opacity: 0.25,
            duration: 0.12,
            yoyo: true,
            repeat: 3,
            ease: "none",
          })
          .to(q("[data-phone]"), {
            x: 0,
            rotate: -6,
            opacity: 1,
            duration: 1,
            ease: "expo.out",
          })
          .to(q("[data-cone]"), { opacity: 1, duration: 0.4 }, "-=0.3")
          .to(q("[data-sticker-glow]"), { opacity: 1, duration: 0.3 }, "<")
          .to(q("[data-beam]"), { opacity: 1, duration: 0.1 }, "<")
          .to(q("[data-beam]"), {
            y: 92,
            duration: 0.55,
            yoyo: true,
            repeat: 2,
            ease: "sine.inOut",
          })
          .to(q("[data-beam], [data-cone]"), { opacity: 0, duration: 0.25 })
          .to(q("[data-verdict]"), { opacity: 1, duration: 0.3 }, "<")
          .from(
            q("[data-verdict-tick]"),
            { drawSVG: 0, duration: 0.5, ease: "power2.out" },
            "<0.1",
          )
          .to(
            q("[data-toast]"),
            { scale: 1, opacity: 1, duration: 0.7, ease: "back.out(2.2)" },
            "<0.15",
          )
          .to(q("[data-sticker-glow]"), { opacity: 0, duration: 0.6 }, "<")
          .to({}, { duration: 2.4 })
          .to(q("[data-toast]"), {
            scale: 0.6,
            opacity: 0,
            duration: 0.35,
            ease: "power2.in",
          })
          .to(
            q("[data-phone]"),
            {
              x: 240,
              rotate: 14,
              opacity: 0,
              duration: 0.7,
              ease: "power3.in",
            },
            "<",
          )
          .to(
            q("[data-tomato]"),
            {
              y: -40,
              opacity: 0,
              duration: 0.5,
              stagger: 0.06,
              ease: "power2.in",
            },
            "<0.2",
          );

        // Pointer parallax — layers drift by their data-depth.
        const layers = q<SVGGElement>("[data-depth]").map((layer) => ({
          depth: Number(layer.dataset.depth),
          x: gsap.quickTo(layer, "x", { duration: 0.9, ease: "power3" }),
          y: gsap.quickTo(layer, "y", { duration: 0.9, ease: "power3" }),
        }));
        const move = (event: PointerEvent) => {
          const rect = el.getBoundingClientRect();
          const px = (event.clientX - rect.left) / rect.width - 0.5;
          const py = (event.clientY - rect.top) / rect.height - 0.5;
          for (const layer of layers) {
            layer.x(px * layer.depth);
            layer.y(py * layer.depth);
          }
        };
        const leave = () => {
          for (const layer of layers) {
            layer.x(0);
            layer.y(0);
          }
        };
        el.addEventListener("pointermove", move);
        el.addEventListener("pointerleave", leave);
        return () => {
          el.removeEventListener("pointermove", move);
          el.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  // Ambient life: chai steam and the swinging price tag.
  useEffect(() => {
    if (
      !root.current ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const scope = root.current;
    const animations = [
      animate(scope.querySelectorAll("[data-steam]"), {
        translateY: [8, -14],
        opacity: [0, 0.7, 0],
        duration: 2200,
        delay: stagger(500),
        loop: true,
        ease: "inOutSine",
      }),
      animate(scope.querySelectorAll("[data-tag]"), {
        rotate: [-5, 5],
        duration: 1800,
        loop: true,
        alternate: true,
        ease: "inOutSine",
      }),
      animate(scope.querySelectorAll("[data-jar-shine]"), {
        opacity: [0.2, 0.7],
        duration: 1400,
        delay: stagger(300),
        loop: true,
        alternate: true,
        ease: "inOutQuad",
      }),
    ];
    return () => {
      for (const animation of animations) {
        animation.revert();
      }
    };
  }, []);

  return (
    <div className="relative size-full" ref={root}>
      <svg
        aria-label="A shop scale weighing tomatoes while a phone scans its Legal Metrology QR seal and shows it is stamped"
        className="size-full overflow-visible"
        fill="none"
        role="img"
        viewBox="0 0 600 520"
      >
        <defs>
          <linearGradient id="cs-steel" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#f4f6fb" />
            <stop offset="1" stopColor="#aab3c7" />
          </linearGradient>
          <linearGradient id="cs-body" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="#2a377a" />
            <stop offset="1" stopColor="#141c44" />
          </linearGradient>
          <linearGradient id="cs-cone" x1="1" x2="0" y1="0" y2="0">
            <stop offset="0" stopColor="#5ee0f5" stopOpacity=".55" />
            <stop offset="1" stopColor="#5ee0f5" stopOpacity="0" />
          </linearGradient>
          <clipPath id="cs-screen">
            <rect height="196" rx="16" width="104" x="448" y="214" />
          </clipPath>
        </defs>

        {/* ------------------------------------------------ Back wall */}
        <g data-depth="-10">
          <rect
            fill={INK}
            height="10"
            opacity=".85"
            rx="5"
            width="250"
            x="36"
            y="120"
          />
          {[
            [56, "#ff9a3c"],
            [118, "#149c4a"],
            [180, "#f6c343"],
            [236, "#e5402f"],
          ].map(([x, color]) => (
            <g key={String(x)}>
              <rect
                fill={INK}
                height="10"
                rx="3"
                width="40"
                x={Number(x) - 4}
                y="52"
              />
              <rect
                fill={String(color)}
                height="58"
                rx="10"
                stroke={INK}
                strokeWidth="3"
                width="32"
                x={x}
                y="62"
              />
              <rect
                data-jar-shine
                fill="#fff"
                height="30"
                opacity=".4"
                rx="3"
                width="5"
                x={Number(x) + 6}
                y="72"
              />
            </g>
          ))}

          {/* Price tag on a string */}
          <g
            data-tag
            style={{ transformBox: "fill-box", transformOrigin: "50% 0%" }}
          >
            <path d="M470 20v34" stroke={INK} strokeWidth="2" />
            <rect
              fill="#fff7e6"
              height="58"
              rx="8"
              stroke={INK}
              strokeWidth="3"
              width="110"
              x="415"
              y="54"
            />
            <text
              fill={INK}
              fontSize="17"
              fontWeight="700"
              style={{ fontFamily: "var(--font-deva)" }}
              textAnchor="middle"
              x="470"
              y="80"
            >
              टमाटर
            </text>
            <text
              fill="#e5402f"
              fontSize="15"
              fontWeight="700"
              style={{ fontFamily: "var(--font-geist)" }}
              textAnchor="middle"
              x="470"
              y="101"
            >
              ₹40 / kg
            </text>
          </g>
        </g>

        {/* ------------------------------------------------ Counter */}
        <rect
          fill="#e7c89c"
          height="26"
          rx="6"
          stroke={INK}
          strokeWidth="3"
          width="580"
          x="10"
          y="390"
        />
        <rect
          fill="#c9975f"
          height="110"
          stroke={INK}
          strokeWidth="3"
          width="560"
          x="20"
          y="414"
        />
        {[70, 190, 310, 430, 550].map((x) => (
          <path
            d={`M${x} 420v100`}
            key={x}
            stroke={INK}
            strokeOpacity=".18"
            strokeWidth="3"
          />
        ))}

        {/* Chai glass with steam */}
        <g data-depth="6">
          <path
            d="M40 348h40l-5 42H45z"
            fill="#fff"
            fillOpacity=".55"
            stroke={INK}
            strokeWidth="3"
          />
          <path d="M44 362h32l-3 26H47z" fill="#b8763b" />
          {[48, 60, 72].map((x) => (
            <path
              d={`M${x} 338c-6-8 6-12 0-22`}
              data-steam
              key={x}
              stroke={INK}
              strokeLinecap="round"
              strokeOpacity=".35"
              strokeWidth="3"
            />
          ))}
        </g>

        {/* ------------------------------------------------ Scale */}
        <g data-depth="10">
          <ellipse cx="260" cy="392" fill={INK} opacity=".15" rx="150" ry="8" />

          <g data-pan>
            <rect
              fill="#8d97ad"
              height="20"
              rx="4"
              stroke={INK}
              strokeWidth="3"
              width="44"
              x="238"
              y="270"
            />
            <rect
              fill="url(#cs-steel)"
              height="22"
              rx="11"
              stroke={INK}
              strokeWidth="3"
              width="270"
              x="125"
              y="256"
            />

            {TOMATOES.map(([cx, cy]) => (
              <g data-tomato key={`${cx}-${cy}`}>
                <Tomato cx={cx} cy={cy} />
              </g>
            ))}
          </g>

          <path
            d="M118 390l26-100h232l26 100z"
            fill="url(#cs-body)"
            stroke={INK}
            strokeLinejoin="round"
            strokeWidth="3"
          />
          <path
            d="M150 300h220"
            stroke="#fff"
            strokeOpacity=".15"
            strokeWidth="3"
          />

          {/* LED readout */}
          <rect
            fill="#06140d"
            height="50"
            rx="8"
            stroke="#0a0f24"
            strokeWidth="3"
            width="150"
            x="152"
            y="310"
          />
          <text
            data-led
            fill="#7dffb0"
            fontSize="30"
            fontWeight="600"
            style={{ fontFamily: "var(--font-geist-mono)" }}
            textAnchor="end"
            x="272"
            y="345"
          >
            1.250
          </text>
          <text
            fill="#7dffb0"
            fillOpacity=".7"
            fontSize="12"
            style={{ fontFamily: "var(--font-geist)" }}
            x="276"
            y="345"
          >
            kg
          </text>
          {[168, 186, 204].map((x) => (
            <circle
              cx={x}
              cy="375"
              fill="#3d5afe"
              fillOpacity=".7"
              key={x}
              r="5"
            />
          ))}
          <text
            fill="#fff"
            fillOpacity=".45"
            fontSize="9"
            letterSpacing="1.5"
            style={{ fontFamily: "var(--font-geist)" }}
            x="218"
            y="378"
          >
            TARE · ZERO
          </text>

          {/* QR seal sticker */}
          <rect
            data-sticker-glow
            fill="none"
            height="84"
            rx="12"
            stroke="#5ee0f5"
            strokeWidth="5"
            width="70"
            x="311"
            y="299"
          />
          <g>
            <rect
              fill="#fff"
              height="72"
              rx="7"
              stroke={INK}
              strokeWidth="2.5"
              width="58"
              x="317"
              y="305"
            />
            <rect
              fill="#149c4a"
              height="14"
              rx="3"
              width="50"
              x="321"
              y="309"
            />
            <text
              fill="#fff"
              fontSize="8"
              fontWeight="700"
              letterSpacing=".8"
              style={{ fontFamily: "var(--font-geist)" }}
              textAnchor="middle"
              x="346"
              y="319"
            >
              LM ✓
            </text>
            {STICKER_CELLS.map((cell) => (
              <rect
                fill={INK}
                height="6"
                key={cell}
                rx="1"
                width="6"
                x={325 + (cell % 6) * 7}
                y={328 + Math.floor(cell / 6) * 7}
              />
            ))}
          </g>
        </g>

        {/* ------------------------------------------------ Phone */}
        <g data-depth="22">
          <path d="M448 300L384 318v48l64 30z" data-cone fill="url(#cs-cone)" />
          <g
            data-phone
            style={{ transformBox: "fill-box", transformOrigin: "50% 100%" }}
          >
            <rect fill={INK} height="220" rx="26" width="124" x="438" y="202" />
            <rect
              fill="#0f1a3a"
              height="196"
              rx="16"
              width="104"
              x="448"
              y="214"
            />
            <g clipPath="url(#cs-screen)">
              <path
                d="M470 262h-10v-10m70 0h10v10m0 80v10h-10m-70 0h-10v-10"
                stroke="#fff"
                strokeLinecap="round"
                strokeOpacity=".85"
                strokeWidth="3"
              />
              {STICKER_CELLS.map((cell) => (
                <rect
                  fill="#fff"
                  fillOpacity=".75"
                  height="8"
                  key={cell}
                  rx="1.5"
                  width="8"
                  x={475 + (cell % 6) * 9}
                  y={276 + Math.floor(cell / 6) * 9}
                />
              ))}
              <rect
                data-beam
                fill="#5ee0f5"
                height="3"
                rx="1.5"
                width="80"
                x="460"
                y="258"
              />

              <g data-verdict>
                <rect fill="#149c4a" height="196" width="104" x="448" y="214" />
                <circle
                  cx="500"
                  cy="290"
                  fill="#fff"
                  fillOpacity=".18"
                  r="30"
                />
                <path
                  d="M486 290l10 10 20-22"
                  data-verdict-tick
                  stroke="#fff"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="6"
                />
                <text
                  fill="#fff"
                  fontSize="15"
                  fontWeight="700"
                  style={{ fontFamily: "var(--font-geist)" }}
                  textAnchor="middle"
                  x="500"
                  y="348"
                >
                  Stamped
                </text>
                <text
                  fill="#fff"
                  fillOpacity=".75"
                  fontSize="10"
                  style={{ fontFamily: "var(--font-geist)" }}
                  textAnchor="middle"
                  x="500"
                  y="366"
                >
                  LM-UP-PRY-000123
                </text>
              </g>
            </g>
            <rect fill="#0a0f24" height="6" rx="3" width="34" x="483" y="222" />
          </g>

          {/* Result toast */}
          <g
            data-toast
            style={{ transformBox: "fill-box", transformOrigin: "100% 100%" }}
          >
            <rect
              fill="#fff"
              height="62"
              rx="16"
              stroke={INK}
              strokeWidth="3"
              width="206"
              x="300"
              y="130"
            />
            <circle cx="330" cy="161" fill="#149c4a" r="15" />
            <path
              d="M323 161l5 5 9-10"
              stroke="#fff"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
            />
            <text
              fill={INK}
              fontSize="14"
              fontWeight="700"
              style={{ fontFamily: "var(--font-geist)" }}
              x="354"
              y="157"
            >
              Verified by LMO
            </text>
            <text
              fill={INK}
              fillOpacity=".6"
              fontSize="11"
              style={{ fontFamily: "var(--font-geist)" }}
              x="354"
              y="175"
            >
              Valid till 11 Jun 2026
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};
