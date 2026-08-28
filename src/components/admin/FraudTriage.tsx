"use client";

import {
  EyeOff,
  FileWarning,
  ImageIcon,
  Siren,
  ThumbsDown,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { fraudReports } from "@/lib/data";

const severityTone = { High: "red", Medium: "amber", Low: "slate" } as const;

/** Complaint density per locality — drives the cluster plate on the right. */
const clusters = [
  { locality: "Govind Nagar, Kanpur", count: 34, top: "26%", left: "22%" },
  { locality: "Aminabad, Lucknow", count: 27, top: "44%", left: "48%" },
  { locality: "Civil Lines, Bareilly", count: 19, top: "20%", left: "68%" },
  { locality: "Mundera Mandi, Prayagraj", count: 12, top: "68%", left: "40%" },
  { locality: "Chowk, Varanasi", count: 8, top: "74%", left: "72%" },
];

const size = (count: number) =>
  count > 30
    ? "size-14"
    : count > 20
      ? "size-12"
      : count > 10
        ? "size-10"
        : "size-8";

export const FraudTriage = () => {
  const [activeId, setActiveId] = useState(fraudReports[0].id);
  const [decisions, setDecisions] = useState<Record<string, string>>({});

  const active =
    fraudReports.find((report) => report.id === activeId) ?? fraudReports[0];

  const decide = (verdict: string) =>
    setDecisions((current) => ({ ...current, [active.id]: verdict }));

  return (
    <div className="grid gap-4 xl:grid-cols-[20rem_minmax(0,1fr)_20rem]">
      {/* --------------------------------------------------------- Inbox */}
      <Panel
        bodyClassName="divide-y divide-line-soft"
        hint={`${fraudReports.length} open complaints`}
        title="Priority inbox"
      >
        {fraudReports.map((report) => (
          <button
            className={`flex w-full flex-col items-start gap-1 px-4 py-3 text-left transition-colors hover:bg-surface-alt ${
              report.id === active.id ? "bg-navy/4" : ""
            }`}
            key={report.id}
            onClick={() => setActiveId(report.id)}
            type="button"
          >
            <span className="flex w-full items-center justify-between gap-2">
              <span className="num text-[11px] font-semibold text-ink">
                {report.id}
              </span>
              <Badge tone={severityTone[report.severity]}>
                {report.severity}
              </Badge>
            </span>
            <span className="text-[12.5px] font-semibold text-ink">
              {report.shop}
            </span>
            <span className="text-[11px] text-ink-muted">{report.issue}</span>
            <span className="num text-[10.5px] text-ink-muted">
              {report.filedOn}
            </span>
            {decisions[report.id] ? (
              <Badge tone="green">{decisions[report.id]}</Badge>
            ) : null}
          </button>
        ))}
      </Panel>

      {/* -------------------------------------------------------- Detail */}
      <div className="space-y-4">
        <Panel
          action={
            <Badge tone={severityTone[active.severity]}>
              {active.severity} severity
            </Badge>
          }
          title={`Complaint ${active.id}`}
        >
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-2">
            {[
              ["Establishment", active.shop],
              ["Locality", active.locality],
              ["Nature of complaint", active.issue],
              ["Filed on", active.filedOn],
              ["Complainant", active.anonymous ? "Anonymous" : "Identified"],
              ["Evidence attached", `${active.evidence} photo(s)`],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] uppercase tracking-wide text-ink-muted">
                  {label}
                </dt>
                <dd className="mt-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-ink">
                  {label === "Complainant" ? (
                    active.anonymous ? (
                      <EyeOff className="size-3.5 text-ink-muted" aria-hidden />
                    ) : (
                      <UserRound
                        className="size-3.5 text-ink-muted"
                        aria-hidden
                      />
                    )
                  ) : null}
                  {value}
                </dd>
              </div>
            ))}
          </dl>

          <div className="mt-4">
            <p className="mb-2 text-[11px] uppercase tracking-wide text-ink-muted">
              Evidence
            </p>
            <div className="flex flex-wrap gap-2.5">
              {Array.from(
                { length: Math.max(active.evidence, 1) },
                (_, index) => index,
              ).map((index) => (
                <div
                  className="flex size-24 flex-col items-center justify-center gap-1 rounded-gov border border-line bg-surface-alt text-[10px] text-ink-muted"
                  key={index}
                >
                  <ImageIcon className="size-5" aria-hidden />
                  {active.evidence ? `EVID_${index + 1}.jpg` : "No photo"}
                </div>
              ))}
            </div>
          </div>

          <p className="mt-4 rounded-gov bg-surface-alt p-3 text-[12px] leading-4.5 text-ink-muted">
            &ldquo;Bought 2 kg sugar, weighed 1.82 kg on my own verified scale
            at home. The shop&apos;s display was showing 2.000 kg and the
            sticker on the machine looked peeled at one corner.&rdquo;
          </p>
        </Panel>

        <Panel title="Action">
          {decisions[active.id] ? (
            <p className="rounded-gov border border-emerald-300 bg-emerald-50 p-3.5 text-[12.5px] text-emerald-900">
              Recorded: <strong>{decisions[active.id]}</strong>. The complainant
              is notified by SMS, and the action appears on the officer&apos;s
              task queue immediately.
            </p>
          ) : (
            <div className="grid gap-2.5 sm:grid-cols-3">
              <Button
                onClick={() => decide("Raid assigned to LMO/PRY/04")}
                variant="danger"
              >
                <Siren className="size-4" aria-hidden />
                Assign surprise raid
              </Button>
              <Button
                onClick={() => decide("Show-cause notice issued")}
                variant="secondary"
              >
                <FileWarning className="size-4" aria-hidden />
                Issue show-cause
              </Button>
              <Button
                onClick={() => decide("Dismissed — false alarm")}
                variant="secondary"
              >
                <ThumbsDown className="size-4" aria-hidden />
                Dismiss
              </Button>
            </div>
          )}
        </Panel>
      </div>

      {/* -------------------------------------------------------- Hotspots */}
      <Panel
        bodyClassName="p-0"
        hint="Complaint density by locality"
        title="Hotspot map"
      >
        <div className="relative h-72 overflow-hidden bg-[#e7edf5]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70 [background-image:linear-gradient(#c9d6e6_1px,transparent_1px),linear-gradient(90deg,#c9d6e6_1px,transparent_1px)] [background-size:30px_30px]"
          />
          {clusters.map((cluster) => (
            <span
              className={`absolute flex ${size(cluster.count)} -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-red-500/25 ring-1 ring-red-500/40`}
              key={cluster.locality}
              style={{ top: cluster.top, left: cluster.left }}
              title={`${cluster.locality} — ${cluster.count} complaints`}
            >
              <span className="num text-[10px] font-bold text-red-800">
                {cluster.count}
              </span>
            </span>
          ))}
        </div>

        <ul className="divide-y divide-line-soft">
          {clusters.map((cluster) => (
            <li
              className="flex items-center justify-between gap-3 px-4 py-2.5"
              key={cluster.locality}
            >
              <span className="text-[12px] text-ink">{cluster.locality}</span>
              <span className="num text-[12px] font-semibold text-red-700">
                {cluster.count}
              </span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
};
