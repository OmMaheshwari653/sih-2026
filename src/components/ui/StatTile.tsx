import type { LucideIcon } from "lucide-react";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const tones = {
  navy: "bg-navy/8 text-navy",
  green: "bg-emerald-100 text-emerald-700",
  amber: "bg-amber-100 text-amber-700",
  red: "bg-red-100 text-red-700",
  violet: "bg-violet-100 text-violet-700",
  sky: "bg-sky-100 text-sky-700",
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
  <article className="flex flex-col justify-between rounded-gov border border-line bg-surface p-4">
    <div className="flex items-start gap-3">
      <span
        className={`flex size-10 shrink-0 items-center justify-center rounded-gov ${tones[tone]}`}
      >
        <Icon className="size-5" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="num text-2xl font-bold leading-none text-ink">{value}</p>
        <p className="mt-1.5 text-xs text-ink-muted">{label}</p>
      </div>
    </div>

    {href ? (
      <Link
        className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-navy-500 hover:underline"
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
