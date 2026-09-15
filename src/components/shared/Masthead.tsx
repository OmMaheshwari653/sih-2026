import { Contrast, Landmark } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { LogoMark } from "@/components/brand/Logo";

/** Slim identity line carried by every Government of India portal. */
export const GovStrip = () => (
  <div className="text-[11px] text-ink-muted">
    <div className="mx-auto flex w-full max-w-360 flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-2 sm:px-6">
      <div className="flex items-center gap-2">
        <span className="tricolor-rule h-3 w-1 rounded-full" aria-hidden />
        <Landmark className="size-3.5 text-ink/70" aria-hidden />
        <span className="font-deva font-medium text-ink">भारत सरकार</span>
        <span className="hidden text-ink/20 sm:inline">/</span>
        <span className="hidden tracking-wide sm:inline">
          Government of India
        </span>
      </div>

      <div className="flex items-center gap-1">
        <a
          className="hidden rounded-full px-2 py-0.5 hover:bg-white/60 hover:text-ink lg:inline"
          href="#main"
        >
          Skip to content
        </a>
        <a
          className="hidden rounded-full px-2 py-0.5 hover:bg-white/60 hover:text-ink lg:inline"
          href="#footer"
        >
          Screen reader
        </a>
        <div className="hidden items-center rounded-full border border-white/70 bg-white/40 p-0.5 sm:flex">
          {["A−", "A", "A+"].map((size) => (
            <button
              className="rounded-full px-2 py-0.5 hover:bg-white hover:text-ink"
              key={size}
              type="button"
            >
              {size}
            </button>
          ))}
        </div>
        <button
          aria-label="High contrast"
          className="rounded-full p-1 hover:bg-white/60 hover:text-ink"
          type="button"
        >
          <Contrast className="size-3.5" aria-hidden />
        </button>
        <button
          className="rounded-full border border-white/70 bg-white/40 px-2.5 py-0.5 hover:bg-white hover:text-ink"
          type="button"
        >
          EN / <span className="font-deva">हिन्दी</span>
        </button>
      </div>
    </div>
  </div>
);

/** Product lockup used inside the floating header. */
export const Brand = () => (
  <Link
    aria-label="Legal Metrology Online Verification System — home"
    className="group flex min-w-0 items-center gap-2.5"
    href="/"
  >
    <LogoMark className="size-9 shrink-0 drop-shadow-[0_6px_14px_rgb(31_42_94/0.35)] transition-transform duration-500 ease-glass group-hover:-rotate-12 group-hover:scale-110" />
    <span className="hidden min-w-0 sm:block">
      <span className="block truncate text-sm font-semibold leading-tight tracking-tight text-ink">
        Legal Metrology
      </span>
      <span className="block truncate text-[11px] text-ink-muted">
        Online Verification System
      </span>
    </span>
  </Link>
);

/** Floating glass identity bar. `right` carries page-specific controls. */
export const Masthead = ({
  right,
  children,
}: {
  right?: ReactNode;
  children?: ReactNode;
}) => (
  <div className="sticky top-0 z-30 px-3 pt-1 sm:px-4">
    <div className="glass-strong mx-auto flex w-full max-w-360 flex-wrap items-center justify-between gap-3 rounded-2xl px-3 py-2 sm:px-4">
      <Brand />
      {children}
      {right}
    </div>
  </div>
);
