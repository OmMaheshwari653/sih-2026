import { useId } from "react";

/**
 * Product mark — a balance scale struck inside a seal. Strokes carry
 * `data-logo-stroke` so the intro and hover animations can draw them.
 */
export const LogoMark = ({
  className = "size-10",
  ...rest
}: {
  className?: string;
  "data-logo"?: boolean;
}) => {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 48 48"
      {...rest}
    >
      <defs>
        <linearGradient id={`${id}-ring`} x1="4" x2="44" y1="4" y2="44">
          <stop offset="0" stopColor="#6d83ff" />
          <stop offset=".55" stopColor="#3fd0ea" />
          <stop offset="1" stopColor="#ffa24d" />
        </linearGradient>
        <linearGradient id={`${id}-plate`} x1="24" x2="24" y1="0" y2="48">
          <stop offset="0" stopColor="#2a377a" />
          <stop offset="1" stopColor="#0b1030" />
        </linearGradient>
        <radialGradient cx="30%" cy="10%" id={`${id}-shine`} r="70%">
          <stop offset="0" stopColor="#fff" stopOpacity=".35" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect fill={`url(#${id}-plate)`} height="48" rx="14" width="48" />
      <rect fill={`url(#${id}-shine)`} height="48" rx="14" width="48" />
      <rect
        data-logo-stroke
        height="45"
        rx="12.5"
        stroke={`url(#${id}-ring)`}
        strokeOpacity=".9"
        strokeWidth="1.5"
        width="45"
        x="1.5"
        y="1.5"
      />

      <g
        stroke="#fff"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <path d="M24 14.5V34" data-logo-stroke />
        <path d="M17.5 34.5h13" data-logo-stroke />
        <g data-logo-beam style={{ transformOrigin: "24px 16px" }}>
          <path d="M12 17h24" data-logo-stroke />
          <path d="M14 17l-3.6 8.5M14 17l3.6 8.5" data-logo-stroke />
          <path d="M34 17l-3.6 8.5M34 17l3.6 8.5" data-logo-stroke />
          <path d="M9.4 25.5a4.6 4.6 0 0 0 9.2 0z" data-logo-stroke />
          <path d="M29.4 25.5a4.6 4.6 0 0 0 9.2 0z" data-logo-stroke />
        </g>
      </g>
      <circle cx="24" cy="13" fill={`url(#${id}-ring)`} r="2.6" />
    </svg>
  );
};

/** Mark plus wordmark, for headers and the intro. */
export const Logo = ({ compact }: { compact?: boolean }) => (
  <span className="flex items-center gap-2.5">
    <LogoMark className="size-9 shrink-0 drop-shadow-[0_6px_14px_rgb(31_42_94/0.35)]" />
    {compact ? null : (
      <span className="leading-tight">
        <span className="block text-[15px] font-semibold tracking-tight text-ink">
          Legal Metrology
        </span>
        <span className="block text-[11px] text-ink-muted">
          Online Verification System
        </span>
      </span>
    )}
  </span>
);
