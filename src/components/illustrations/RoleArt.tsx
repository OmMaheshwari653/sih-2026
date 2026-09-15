"use client";

import { animate, stagger } from "animejs";
import type { CSSProperties } from "react";
import { useAnimeScope } from "@/lib/anime";

const pivot = (origin = "50% 50%"): CSSProperties => ({
  transformBox: "fill-box",
  transformOrigin: origin,
});

const INK = "#121a3e";

/** Shopfront with a stamped scale on the counter. */
export const TraderArt = ({ className = "" }: { className?: string }) => {
  const ref = useAnimeScope<SVGSVGElement>(() => {
    animate(".awning", {
      rotate: [-1.5, 1.5],
      duration: 2600,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
    animate(".beam", {
      rotate: [-9, 9],
      duration: 1900,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
    animate(".pan", {
      rotate: [9, -9],
      duration: 1900,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
    animate(".cert", {
      translateY: [0, -5],
      duration: 2200,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
    animate(".tick", {
      strokeDashoffset: [18, 0],
      duration: 900,
      delay: 600,
      loopDelay: 2200,
      ease: "outExpo",
      loop: true,
    });
  });

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      ref={ref}
      viewBox="0 0 160 110"
    >
      <defs>
        <linearGradient id="trader-wall" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#eef1ff" />
          <stop offset="1" stopColor="#dfe6ff" />
        </linearGradient>
      </defs>
      <ellipse cx="80" cy="104" fill={INK} opacity=".08" rx="62" ry="5" />
      <rect
        fill="url(#trader-wall)"
        height="62"
        rx="6"
        width="104"
        x="20"
        y="38"
      />
      <rect
        fill="#fff"
        height="30"
        opacity=".7"
        rx="3"
        width="36"
        x="30"
        y="50"
      />

      <g className="awning" style={pivot("50% 0%")}>
        <path
          d="M16 26h112l-4 14H20z"
          fill="#fff"
          stroke={INK}
          strokeWidth="1.5"
        />
        {[0, 2, 4, 6].map((index) => (
          <path
            d={`M${16 + index * 14} 26h14l-1 14H${20 + index * 14}z`}
            fill="#ff9a3c"
            key={index}
          />
        ))}
        <path
          d="M20 40c3 5 11 5 14 0 3 5 11 5 14 0 3 5 11 5 14 0 3 5 11 5 14 0 3 5 11 5 14 0 3 5 11 5 14 0 3 5 11 5 14 0"
          stroke={INK}
          strokeWidth="1.5"
        />
      </g>

      <rect
        fill="#fff"
        height="18"
        rx="3"
        stroke={INK}
        strokeWidth="1.5"
        width="112"
        x="16"
        y="82"
      />

      {/* Scale on the counter */}
      <path
        d="M96 82V62"
        stroke={INK}
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <path
        d="M90 82h12"
        stroke={INK}
        strokeLinecap="round"
        strokeWidth="1.8"
      />
      <g className="beam" style={pivot("50% 50%")}>
        <path
          d="M82 62h28"
          stroke={INK}
          strokeLinecap="round"
          strokeWidth="1.8"
        />
        <g className="pan" style={pivot("50% 0%")}>
          <path
            d="M84 62l-4 9h8z"
            stroke={INK}
            strokeLinejoin="round"
            strokeWidth="1.2"
          />
          <path
            d="M79 71a5 5 0 0 0 10 0z"
            fill="#6d83ff"
            stroke={INK}
            strokeWidth="1.2"
          />
        </g>
        <g className="pan" style={pivot("50% 0%")}>
          <path
            d="M108 62l-4 9h8z"
            stroke={INK}
            strokeLinejoin="round"
            strokeWidth="1.2"
          />
          <path
            d="M103 71a5 5 0 0 0 10 0z"
            fill="#3fd0ea"
            stroke={INK}
            strokeWidth="1.2"
          />
        </g>
      </g>
      <circle cx="96" cy="61" fill="#ff9a3c" r="2.4" />

      {/* Produce */}
      <circle cx="36" cy="78" fill="#149c4a" r="5" />
      <circle cx="46" cy="78" fill="#ff9a3c" r="5" />
      <circle cx="41" cy="72" fill="#f43f5e" r="5" />

      <g className="cert">
        <rect
          fill="#fff"
          height="30"
          rx="5"
          stroke={INK}
          strokeWidth="1.5"
          width="30"
          x="122"
          y="10"
        />
        <circle cx="137" cy="22" fill="#149c4a" r="7" />
        <path
          className="tick"
          d="M133.5 22l2.5 2.5 4.5-5"
          stroke="#fff"
          strokeDasharray="18"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.8"
        />
        <path
          d="M129 33h16"
          stroke={INK}
          strokeLinecap="round"
          strokeOpacity=".3"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
};

/** Route card, a geo-fence pulse and an inspection checklist. */
export const OfficerArt = ({ className = "" }: { className?: string }) => {
  const ref = useAnimeScope<SVGSVGElement>(() => {
    animate(".route", {
      strokeDashoffset: [0, -28],
      duration: 1600,
      ease: "linear",
      loop: true,
    });
    animate(".pulse", {
      scale: [0.4, 2.4],
      opacity: [0.55, 0],
      duration: 2200,
      delay: stagger(700),
      ease: "outSine",
      loop: true,
    });
    animate(".pin", {
      translateY: [0, -4],
      duration: 900,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
    animate(".check", {
      strokeDashoffset: [14, 0],
      duration: 500,
      delay: stagger(350, { start: 300 }),
      loopDelay: 2400,
      ease: "outQuad",
      loop: true,
    });
  });

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      ref={ref}
      viewBox="0 0 160 110"
    >
      <ellipse cx="80" cy="104" fill={INK} opacity=".08" rx="62" ry="5" />

      <g transform="rotate(-6 60 55)">
        <rect
          fill="#e8f7f0"
          height="74"
          rx="10"
          stroke={INK}
          strokeWidth="1.5"
          width="92"
          x="12"
          y="18"
        />
        <path
          d="M12 46h92M44 18v74M76 18v74"
          stroke={INK}
          strokeOpacity=".08"
          strokeWidth="6"
        />
        <path
          className="route"
          d="M24 80c14-6 16-22 32-26s24 8 38-20"
          stroke="#149c4a"
          strokeDasharray="5 4"
          strokeLinecap="round"
          strokeWidth="2.2"
        />
        <circle
          cx="24"
          cy="80"
          fill="#fff"
          r="4"
          stroke={INK}
          strokeWidth="1.5"
        />
      </g>

      <g transform="translate(88 34)">
        {[0, 1, 2].map((ring) => (
          <circle
            className="pulse"
            cx="0"
            cy="0"
            fill="#149c4a"
            fillOpacity=".25"
            key={ring}
            r="8"
            stroke="#149c4a"
            style={pivot()}
          />
        ))}
        <g className="pin">
          <path
            d="M0 6C-6 -1-9-5-9-10a9 9 0 0 1 18 0c0 5-3 9-9 16z"
            fill={INK}
            transform="translate(0 -8)"
          />
          <circle cx="0" cy="-18" fill="#5ee08f" r="3.2" />
        </g>
      </g>

      <g transform="translate(108 40)">
        <rect
          fill="#fff"
          height="58"
          rx="6"
          stroke={INK}
          strokeWidth="1.5"
          width="42"
        />
        <rect fill={INK} height="6" rx="3" width="16" x="13" y="-3" />
        {[0, 1, 2].map((row) => (
          <g key={row} transform={`translate(8 ${14 + row * 14})`}>
            <rect fill="#e8f7f0" height="9" rx="2.5" width="9" />
            <path
              className="check"
              d="M2 4.6l2 2 3.2-3.8"
              stroke="#149c4a"
              strokeDasharray="14"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.6"
            />
            <path
              d="M14 4.5h14"
              stroke={INK}
              strokeLinecap="round"
              strokeOpacity=".25"
              strokeWidth="2"
            />
          </g>
        ))}
      </g>
    </svg>
  );
};

/** A phone reading the QR seal on a scale. */
export const ConsumerArt = ({ className = "" }: { className?: string }) => {
  const ref = useAnimeScope<SVGSVGElement>(() => {
    animate(".beam", {
      translateY: [0, 34],
      duration: 1400,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
    animate(".pixel", {
      opacity: [0.25, 1],
      duration: 700,
      delay: stagger(40, { grid: [5, 5], from: "center" }),
      loop: true,
      alternate: true,
      ease: "inOutQuad",
    });
    animate(".bubble", {
      scale: [0, 1],
      duration: 900,
      delay: 500,
      loopDelay: 1800,
      ease: "outElastic(1, .6)",
      loop: true,
    });
    animate(".phone", {
      rotate: [-4, 2],
      translateY: [0, -3],
      duration: 2400,
      ease: "inOutSine",
      loop: true,
      alternate: true,
    });
  });

  const pixels = [0, 1, 2, 4, 5, 7, 9, 10, 12, 13, 15, 16, 18, 19, 20, 22, 24];

  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      ref={ref}
      viewBox="0 0 160 110"
    >
      <ellipse cx="80" cy="104" fill={INK} opacity=".08" rx="62" ry="5" />

      {/* Scale with the sticker */}
      <rect
        fill="#fff4e8"
        height="34"
        rx="6"
        stroke={INK}
        strokeWidth="1.5"
        width="70"
        x="12"
        y="62"
      />
      <rect
        fill="#fff"
        height="10"
        rx="3"
        stroke={INK}
        strokeWidth="1.5"
        width="80"
        x="7"
        y="54"
      />
      <rect
        fill="#fff"
        height="22"
        rx="3"
        stroke={INK}
        strokeWidth="1.2"
        width="22"
        x="22"
        y="68"
      />
      <g transform="translate(25 71)">
        {pixels.map((index) => (
          <rect
            className="pixel"
            fill={INK}
            height="2.8"
            key={index}
            rx=".6"
            width="2.8"
            x={(index % 5) * 3.3}
            y={Math.floor(index / 5) * 3.3}
          />
        ))}
      </g>
      <rect
        fill="#121a3e"
        height="8"
        opacity=".85"
        rx="2"
        width="22"
        x="52"
        y="72"
      />
      <path
        d="M55 76h16"
        stroke="#5ee08f"
        strokeLinecap="round"
        strokeWidth="1.6"
      />

      <g className="phone" style={pivot("50% 100%")}>
        <rect fill={INK} height="84" rx="11" width="48" x="98" y="12" />
        <rect fill="#e9eeff" height="72" rx="7" width="40" x="102" y="18" />
        <path
          d="M110 30h-4v-4M134 26h4v4M138 60v4h-4M106 64v-4"
          stroke="#3d5afe"
          strokeLinecap="round"
          strokeWidth="1.6"
          transform="translate(0 4)"
        />
        <g className="beam">
          <rect fill="#3fd0ea" height="2" rx="1" width="30" x="107" y="32" />
          <rect
            fill="#3fd0ea"
            height="8"
            opacity=".25"
            rx="2"
            width="30"
            x="107"
            y="26"
          />
        </g>
        <rect fill="#fff" height="10" rx="5" width="30" x="107" y="76" />
      </g>

      <g className="bubble" style={pivot("0% 100%")}>
        <path
          d="M130 8h24a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4h-18l-6 5v-5a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z"
          fill="#149c4a"
        />
        <path
          d="M137 17l3 3 6-6"
          stroke="#fff"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </g>
    </svg>
  );
};
