import type { ReactNode } from "react";
import { type Status, statusLabel } from "@/lib/data";

const tones = {
  green: "border-emerald-300 bg-emerald-50 text-emerald-800",
  amber: "border-amber-300 bg-amber-50 text-amber-800",
  red: "border-red-300 bg-red-50 text-red-800",
  blue: "border-sky-300 bg-sky-50 text-sky-800",
  violet: "border-violet-300 bg-violet-50 text-violet-800",
  slate: "border-line bg-surface-alt text-ink-muted",
  navy: "border-navy/25 bg-navy/5 text-navy",
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
    className={`inline-flex items-center gap-1 rounded-[3px] border px-2 py-0.5 text-[11px] font-semibold leading-5 ${tones[tone]} ${className}`}
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
