"use client";

import { animate, stagger } from "animejs";
import type { CSSProperties } from "react";
import { useAnimeScope } from "@/lib/anime";

const pivot = (origin = "50% 50%"): CSSProperties => ({
  transformBox: "fill-box",
  transformOrigin: origin,
});

const INK = "#121a3e";

const Frame = ({
  children,
  refProp,
  className,
}: {
  children: React.ReactNode;
  refProp: React.Ref<SVGSVGElement>;
  className: string;
}) => (
  <svg
    aria-hidden="true"
    className={className}
    fill="none"
    ref={refProp}
    viewBox="0 0 96 96"
  >
    <defs>
      <linearGradient id="step-plate" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#eef1ff" />
        <stop offset="1" stopColor="#e3fbff" />
      </linearGradient>
    </defs>
    <rect
      data-draw
      fill="url(#step-plate)"
      height="92"
      rx="26"
      stroke="#fff"
      strokeWidth="2"
      width="92"
      x="2"
      y="2"
    />
    {children}
  </svg>
);

/** Application form being filled in. */
export const ApplyArt = ({ className = "size-24" }: { className?: string }) => {
  const ref = useAnimeScope<SVGSVGElement>(() => {
    animate(".line", {
      scaleX: [0, 1],
      duration: 600,
      delay: stagger(260),
      loopDelay: 1600,
      ease: "outExpo",
      loop: true,
    });
    animate(".pen", {
      translateX: [-14, 10],
      translateY: [0, 18],
      duration: 1800,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
  });
  return (
    <Frame className={className} refProp={ref}>
      <rect
        fill="#fff"
        height="56"
        rx="6"
        stroke={INK}
        strokeWidth="2"
        width="44"
        x="22"
        y="20"
      />
      {[32, 42, 52, 62].map((y, index) => (
        <rect
          className="line"
          fill={index === 3 ? "#3d5afe" : INK}
          fillOpacity={index === 3 ? 1 : 0.2}
          height="4"
          key={y}
          rx="2"
          style={pivot("0% 50%")}
          width={index % 2 ? 22 : 30}
          x="29"
          y={y}
        />
      ))}
      <g className="pen">
        <path
          d="M66 46l10-10 5 5-10 10-7 2z"
          fill="#ff9a3c"
          stroke={INK}
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </Frame>
  );
};

/** Geo-fence radar locking onto the premises. */
export const GeoArt = ({ className = "size-24" }: { className?: string }) => {
  const ref = useAnimeScope<SVGSVGElement>(() => {
    animate(".ring", {
      scale: [0.2, 1],
      opacity: [0.8, 0],
      duration: 2400,
      delay: stagger(800),
      ease: "outSine",
      loop: true,
    });
    animate(".sweep", {
      rotate: [0, 360],
      duration: 3200,
      ease: "linear",
      loop: true,
    });
    animate(".pin", {
      translateY: [-6, 0],
      duration: 700,
      ease: "outBounce",
      loop: true,
      loopDelay: 1400,
    });
  });
  return (
    <Frame className={className} refProp={ref}>
      <circle
        cx="48"
        cy="52"
        r="30"
        stroke={INK}
        strokeDasharray="3 4"
        strokeOpacity=".3"
        strokeWidth="1.5"
      />
      {[0, 1, 2].map((ring) => (
        <circle
          className="ring"
          cx="48"
          cy="52"
          fill="#149c4a"
          fillOpacity=".12"
          key={ring}
          r="30"
          stroke="#149c4a"
          strokeWidth="1.5"
          style={pivot()}
        />
      ))}
      <g className="sweep" style={{ transformOrigin: "48px 52px" }}>
        <path
          d="M48 52V22a30 30 0 0 1 26 15z"
          fill="#149c4a"
          fillOpacity=".22"
        />
      </g>
      <g className="pin">
        <path
          d="M48 56c-7-8-10-12-10-17a10 10 0 0 1 20 0c0 5-3 9-10 17z"
          fill={INK}
        />
        <circle cx="48" cy="39" fill="#5ee08f" r="3.5" />
      </g>
    </Frame>
  );
};

/** Error gauge settling inside the permissible band. */
export const GaugeArt = ({ className = "size-24" }: { className?: string }) => {
  const ref = useAnimeScope<SVGSVGElement>(() => {
    animate(".needle", {
      keyframes: [
        { rotate: 70, duration: 700, ease: "outQuad" },
        { rotate: -40, duration: 600, ease: "inOutSine" },
        { rotate: 8, duration: 1400, ease: "outElastic(1, .4)" },
      ],
      loop: true,
      loopDelay: 1200,
    });
    animate(".band", {
      opacity: [0.55, 1],
      duration: 900,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
  });
  return (
    <Frame className={className} refProp={ref}>
      <path
        d="M20 62a28 28 0 0 1 56 0"
        stroke={INK}
        strokeLinecap="round"
        strokeOpacity=".15"
        strokeWidth="8"
      />
      <path
        d="M20 62a28 28 0 0 1 11-22"
        stroke="#ef4444"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        d="M76 62a28 28 0 0 0-11-22"
        stroke="#ef4444"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <path
        className="band"
        d="M39 35.5a28 28 0 0 1 18 0"
        stroke="#149c4a"
        strokeLinecap="round"
        strokeWidth="8"
      />
      <g className="needle" style={{ transformOrigin: "48px 62px" }}>
        <path
          d="M48 62L48 30"
          stroke={INK}
          strokeLinecap="round"
          strokeWidth="3"
        />
      </g>
      <circle cx="48" cy="62" fill={INK} r="5" />
      <rect
        fill="#fff"
        height="12"
        rx="6"
        stroke={INK}
        strokeOpacity=".15"
        width="34"
        x="31"
        y="72"
      />
      <path
        d="M38 78h20"
        stroke="#149c4a"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </Frame>
  );
};

/** Tamper-evident seal being struck. */
export const SealArt = ({ className = "size-24" }: { className?: string }) => {
  const ref = useAnimeScope<SVGSVGElement>(() => {
    animate(".ring", {
      rotate: [0, 360],
      duration: 9000,
      ease: "linear",
      loop: true,
    });
    animate(".stamp", {
      keyframes: [
        { translateY: -14, scale: 1, duration: 500, ease: "outQuad" },
        { translateY: 0, scale: 0.92, duration: 180, ease: "inQuad" },
        { scale: 1, duration: 500, ease: "outElastic(1, .5)" },
      ],
      loop: true,
      loopDelay: 1400,
    });
    animate(".tick", {
      strokeDashoffset: [26, 0],
      duration: 500,
      delay: 700,
      loop: true,
      loopDelay: 1580,
      ease: "outQuad",
    });
  });
  return (
    <Frame className={className} refProp={ref}>
      <g className="ring" style={{ transformOrigin: "48px 50px" }}>
        <circle
          cx="48"
          cy="50"
          r="30"
          stroke="#3d5afe"
          strokeDasharray="2 5"
          strokeLinecap="round"
          strokeWidth="3"
        />
      </g>
      <g className="stamp" style={pivot()}>
        <circle cx="48" cy="50" fill="url(#seal-fill)" r="22" />
        <defs>
          <linearGradient id="seal-fill" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="#27336b" />
            <stop offset="1" stopColor="#0f1535" />
          </linearGradient>
        </defs>
        <path
          className="tick"
          d="M38 50l7 7 13-14"
          stroke="#5ee08f"
          strokeDasharray="26"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="4"
        />
      </g>
    </Frame>
  );
};
