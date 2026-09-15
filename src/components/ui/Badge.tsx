import type { ReactNode } from "react";
import { type Status, statusLabel } from "@/lib/data";

const tones = {
  green: "border-emerald-500/20 bg-emerald-500/10 text-emerald-700",
  amber: "border-amber-500/25 bg-amber-400/15 text-amber-800",
  red: "border-red-500/20 bg-red-500/10 text-red-700",
  blue: "border-sky-500/20 bg-sky-500/10 text-sky-700",
  violet: "border-violet-500/20 bg-violet-500/10 text-violet-700",
  slate: "border-slate-500/15 bg-slate-500/8 text-ink-muted",
  navy: "border-navy-500/20 bg-navy-500/10 text-navy-700",
} as const;

export type Tone = keyof typeof tones;

export const Badge = ({
  children,
  tone = "slate",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) => (
  <span
    className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-5 ${tones[tone]} ${className}`}
  >
    {children}
  </span>
);

const statusTone: Record<Status, Tone> = {
  valid: "green",
  expiring: "amber",
  expired: "red",
  rejected: "red",
  pending: "amber",
  scheduled: "blue",
  "under-verification": "violet",
};

export const StatusBadge = ({ status }: { status: Status }) => (
  <Badge tone={statusTone[status]}>{statusLabel[status]}</Badge>
);
