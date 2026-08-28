import { Contrast, Landmark } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/** Thin blue strip carried by every Government of India portal. */
export const GovStrip = () => (
  <div className="bg-navy-900 text-[11px] text-white">
    <div className="mx-auto flex w-full max-w-360 flex-wrap items-center justify-between gap-x-4 gap-y-1.5 px-4 py-1.5 sm:px-6">
      <div className="flex items-center gap-2">
        <Landmark className="size-3.5 text-saffron" aria-hidden />
        <span className="font-deva font-medium">भारत सरकार</span>
        <span className="hidden text-white/70 sm:inline">|</span>
        <span className="hidden tracking-wide text-white/80 sm:inline">
          GOVERNMENT OF INDIA
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3.5">
        <a className="hidden hover:underline lg:inline" href="#main">
          Skip to Main Content
        </a>
        <span className="hidden text-white/25 lg:inline">|</span>
        <a className="hidden hover:underline lg:inline" href="#footer">
          Screen Reader Access
        </a>
        <span className="hidden text-white/25 lg:inline">|</span>
        <div className="hidden items-center gap-1.5 sm:flex">
          <button className="hover:text-saffron" type="button">
            A+
          </button>
          <button className="hover:text-saffron" type="button">
            A
          </button>
          <button className="hover:text-saffron" type="button">
            A-
          </button>
        </div>
        <span className="hidden text-white/25 sm:inline">|</span>
        <button
          aria-label="High contrast"
          className="hover:text-saffron"
          type="button"
        >
          <Contrast className="size-3.5" aria-hidden />
        </button>
        <span className="text-white/25">|</span>
        <button className="hover:text-saffron" type="button">
          English / <span className="font-deva">हिन्दी</span>
        </button>
      </div>
    </div>
  </div>
);

/** Emblem + portal identity bar. `right` carries page-specific controls. */
export const Masthead = ({ right }: { right?: ReactNode }) => (
  <>
    <div className="border-b border-line bg-surface">
      <div className="mx-auto flex w-full max-w-360 flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link className="flex items-center gap-3 sm:gap-4" href="/">
          <Image
            alt="Department of Consumer Affairs, Government of India"
            className="h-9 w-auto sm:h-11"
            height={279}
            preload
            src="/ministry.png"
            width={830}
          />
          <span aria-hidden className="hidden h-10 w-px bg-line sm:block" />
          <span className="hidden sm:block">
            <span className="block font-serif text-lg font-bold leading-tight text-navy">
              Legal Metrology — Online Verification System
            </span>
            <span className="block text-[11px] text-ink-muted">
              Ensuring accuracy, transparency &amp; consumer protection · Legal
              Metrology Act, 2009
            </span>
          </span>
        </Link>

        {right}
      </div>
    </div>
    <div className="tricolor-rule h-[3px]" />
  </>
);
