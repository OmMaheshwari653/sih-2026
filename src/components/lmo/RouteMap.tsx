"use client";

import { animate, createDrawable, createMotionPath, stagger } from "animejs";
import { useAnimeScope } from "@/lib/anime";

const ROUTE = "M18 78 C26 70 30 62 38 60 S54 70 62 66 S74 40 80 30";

const pins = [
  { x: 18, y: 78, n: 1 },
  { x: 38, y: 60, n: 2 },
  { x: 62, y: 66, n: 3 },
  { x: 80, y: 30, n: 4 },
];

/**
 * Today's inspection route. anime.js draws the path, pops each stop in order
 * and keeps a van marker travelling the route.
 */
export const RouteMap = () => {
  const ref = useAnimeScope<HTMLDivElement>((_scope, root) => {
    const path = root.querySelector<SVGPathElement>("[data-route]");
    if (!path) {
      return;
    }
    animate(createDrawable(path), {
      draw: ["0 0", "0 1"],
      duration: 1800,
      ease: "inOutQuad",
    });
    animate(".pin", {
      scale: [0, 1],
      opacity: [0, 1],
      duration: 700,
      delay: stagger(420, { start: 250 }),
      ease: "outElastic(1, .55)",
    });
    animate(".pin-ring", {
      scale: [1, 2.4],
      opacity: [0.5, 0],
      duration: 1800,
      delay: stagger(300, { start: 1800 }),
      loop: true,
      ease: "outSine",
    });
    animate(".van", {
      ...createMotionPath(path),
      duration: 7000,
      delay: 1800,
      loop: true,
      ease: "inOutSine",
    });
  });

  return (
    <div
      className="relative h-64 overflow-hidden bg-linear-to-br from-sky-50/80 to-indigo-50/60"
      ref={ref}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-60 [background-image:linear-gradient(rgb(61_90_254/0.12)_1px,transparent_1px),linear-gradient(90deg,rgb(61_90_254/0.12)_1px,transparent_1px)] [background-size:32px_32px]"
      />
      <svg
        aria-hidden="true"
        className="absolute inset-0 size-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d="M0 44 C20 40 40 52 60 46 S90 30 100 34"
          fill="none"
          stroke="rgb(61 90 254 / 0.12)"
          strokeWidth="5"
        />
        <path
          d={ROUTE}
          data-route
          fill="none"
          stroke="#3d5afe"
          strokeLinecap="round"
          strokeWidth="1.4"
          vectorEffect="non-scaling-stroke"
        />
        <g className="van">
          <circle fill="#ff9a3c" r="1.8" />
          <circle fill="#fff" r="0.7" />
        </g>
      </svg>

      {pins.map((pin) => (
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          key={pin.n}
          style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
        >
          <span className="pin-ring absolute inset-0 rounded-full bg-navy-500/40" />
          <span className="pin btn-ink num relative flex size-7 items-center justify-center rounded-full text-[11px] font-bold ring-3 ring-white">
            {pin.n}
          </span>
        </span>
      ))}

      <span className="glass absolute bottom-3 left-3 rounded-full px-3 py-1.5 text-[10px] text-ink-muted">
        Start: Circle Office, Civil Lines · 19.6 km total
      </span>
    </div>
  );
};
