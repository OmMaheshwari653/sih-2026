import {
  ArrowRight,
  CalendarClock,
  ClipboardList,
  Navigation,
  Siren,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { StatTile } from "@/components/ui/StatTile";
import { inspections } from "@/lib/data";

export const metadata = { title: "Today's Field Route" };

const priorityTone = {
  Normal: "slate",
  Tatkal: "amber",
  Urgent: "red",
} as const;

const LmoDashboardPage = () => (
  <>
    <PageHeader
      action={
        <p className="num text-[11px] text-ink-muted">
          21 May 2025 · Sadar Circle, Prayagraj
        </p>
      }
      crumbs={[
        { label: "Officer Portal", href: "/lmo/dashboard" },
        { label: "Today" },
      ]}
      subtitle="Four inspections assigned. Route optimised for 19.6 km of travel."
      title="Today's field route"
    />

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        icon={ClipboardList}
        label="Assigned today"
        tone="navy"
        value={4}
      />
      <StatTile
        footnote="Instruments past validity in your circle"
        icon={CalendarClock}
        label="Overdue renewals"
        tone="amber"
        value={218}
      />
      <StatTile
        footnote="Citizen complaints escalated to you"
        icon={Siren}
        label="Pending raids"
        tone="red"
        value={2}
      />
      <StatTile
        footnote="Against a monthly target of 260"
        icon={TriangleAlert}
        label="Stamped this month"
        tone="green"
        value={187}
      />
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_22rem]">
      <Panel
        bodyClassName="divide-y divide-line-soft"
        hint="Tap an entry to open the field workspace"
        title="Task queue"
      >
        {inspections.map((inspection, index) => (
          <Link
            className="flex items-start gap-3 px-4 py-3.5 transition-colors hover:bg-surface-alt"
            href={`/lmo/inspections/${inspection.id}`}
            key={inspection.id}
          >
            <span className="num mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-navy/8 text-[11px] font-bold text-navy">
              {index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[13px] font-semibold text-ink">
                  {inspection.business}
                </p>
                <Badge tone={priorityTone[inspection.priority]}>
                  {inspection.priority}
                </Badge>
                <Badge tone="navy">{inspection.kind}</Badge>
              </div>
              <p className="mt-0.5 text-[11px] text-ink-muted">
                {inspection.address}
              </p>
              <p className="num mt-1 text-[11px] text-ink-muted">
                {inspection.instrument} · {inspection.instrumentId}
              </p>
            </div>

            <div className="shrink-0 text-right">
              <p className="num text-[12px] font-semibold text-ink">
                {inspection.slot}
              </p>
              <p className="num mt-0.5 flex items-center justify-end gap-1 text-[11px] text-ink-muted">
                <Navigation className="size-3" aria-hidden />
                {inspection.distanceKm} km
              </p>
            </div>
          </Link>
        ))}
      </Panel>

      <div className="space-y-4">
        <Panel
          bodyClassName="p-0"
          hint="Optimised sequence for today"
          title="Route map"
        >
          <div className="relative h-64 overflow-hidden bg-[#e7edf5]">
            <div
              aria-hidden
              className="absolute inset-0 opacity-70 [background-image:linear-gradient(#c9d6e6_1px,transparent_1px),linear-gradient(90deg,#c9d6e6_1px,transparent_1px)] [background-size:32px_32px]"
            />
            <svg
              aria-hidden
              className="absolute inset-0 size-full"
              viewBox="0 0 100 100"
            >
              <title>Optimised inspection route</title>
              <path
                d="M18 78 L38 60 L62 66 L80 30"
                fill="none"
                stroke="#0b2b5c"
                strokeDasharray="4 3"
                strokeWidth="1.6"
              />
            </svg>
            {[
              { top: "78%", left: "18%", n: 1 },
              { top: "60%", left: "38%", n: 2 },
              { top: "66%", left: "62%", n: 3 },
              { top: "30%", left: "80%", n: 4 },
            ].map((pin) => (
              <span
                className="num absolute flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-navy text-[10px] font-bold text-white ring-3 ring-white"
                key={pin.n}
                style={{ top: pin.top, left: pin.left }}
              >
                {pin.n}
              </span>
            ))}
            <span className="absolute bottom-3 left-3 rounded-gov border border-line bg-white/95 px-2.5 py-1.5 text-[10px] text-ink-muted">
              Start: Circle Office, Civil Lines · 19.6 km total
            </span>
          </div>
        </Panel>

        <Panel title="Enforcement alerts">
          <ul className="space-y-3">
            <li className="flex items-start gap-2.5">
              <Siren
                className="mt-0.5 size-4 shrink-0 text-red-600"
                aria-hidden
              />
              <p className="text-[12px] leading-4.5 text-ink">
                <span className="font-semibold">2 surprise raids</span> assigned
                from citizen complaints at Mundera Mandi. Both instruments are
                flagged publicly.
                <Link
                  className="ml-1 font-semibold text-navy-500 hover:underline"
                  href="/admin/fraud-reports"
                >
                  Open triage
                </Link>
              </p>
            </li>
            <li className="flex items-start gap-2.5">
              <CalendarClock
                className="mt-0.5 size-4 shrink-0 text-amber-600"
                aria-hidden
              />
              <p className="text-[12px] leading-4.5 text-ink">
                <span className="font-semibold">218 instruments</span> in your
                circle cross validity this month. E-challans generate
                automatically after 30 days.
              </p>
            </li>
          </ul>

          <Link
            className="mt-4 flex items-center justify-center gap-2 rounded-gov border border-line py-2.5 text-xs font-semibold text-ink hover:bg-surface-alt"
            href="/lmo/camp-mode"
          >
            Switch to camp mode
            <ArrowRight className="size-3.5" aria-hidden />
          </Link>
        </Panel>
      </div>
    </div>
  </>
);

export default LmoDashboardPage;
