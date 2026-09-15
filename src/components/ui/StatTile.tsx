import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const tones = {
  navy: "from-indigo-500/20 to-indigo-500/5 text-indigo-700",
  green: "from-emerald-500/20 to-emerald-500/5 text-emerald-700",
  amber: "from-amber-400/25 to-amber-400/5 text-amber-700",
  red: "from-red-500/20 to-red-500/5 text-red-700",
  violet: "from-violet-500/20 to-violet-500/5 text-violet-700",
  sky: "from-sky-500/20 to-sky-500/5 text-sky-700",
} as const;

export const StatTile = ({
  value,
  label,
  icon: Icon,
  tone = "navy",
  href,
  footnote,
}: {
  value: string | number;
  label: string;
  icon: LucideIcon;
  tone?: keyof typeof tones;
  href?: string;
  footnote?: string;
}) => (
  <article className="glass flex flex-col justify-between rounded-3xl p-5 transition-transform duration-300 ease-glass hover:-translate-y-0.5">
    <div className="flex items-start gap-3">
      <span
        className={`flex size-11 shrink-0 items-center justify-center rounded-2xl border border-white/70 bg-linear-to-b shadow-[inset_0_1px_0_rgb(255_255_255/0.8)] ${tones[tone]}`}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p
          className="num text-[26px] font-semibold leading-none text-ink"
          data-count
        >
          {value}
        </p>
        <p className="mt-1.5 text-xs text-ink-muted">{label}</p>
      </div>
    </div>

    {href ? (
      <Link
        className="mt-4 inline-flex w-fit items-center gap-1 rounded-full bg-white/60 px-2.5 py-1 text-[11px] font-semibold text-navy-500 transition-colors hover:bg-white"
        href={href}
      >
        View All
        <ArrowRight className="size-3" aria-hidden />
      </Link>
    ) : null}
    {footnote ? (
      <p className="mt-3 text-[11px] text-ink-muted">{footnote}</p>
    ) : null}
  </article>
);
