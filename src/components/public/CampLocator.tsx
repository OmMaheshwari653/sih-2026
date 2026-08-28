"use client";

import {
  CalendarDays,
  Clock3,
  MapPin,
  Radio,
  Truck,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Chip, Select } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { type Camp, camps } from "@/lib/data";

/** Hand-placed pins — a real deployment would render these from GeoJSON. */
const pins: Record<string, { top: string; left: string }> = {
  "CAMP-PRY-11": { top: "58%", left: "44%" },
  "CAMP-PRY-12": { top: "38%", left: "56%" },
  "CAMP-PRY-13": { top: "70%", left: "62%" },
  "CAMP-KNP-04": { top: "30%", left: "24%" },
  "CAMP-LKO-09": { top: "18%", left: "40%" },
};

const stateTone = {
  active: "green",
  upcoming: "blue",
  completed: "slate",
} as const;

const stateLabel = {
  active: "Active now",
  upcoming: "Upcoming",
  completed: "Completed",
} as const;

const districts = [
  "All districts",
  ...new Set(camps.map((camp) => camp.district)),
];
const filters = ["All", "Active now", "Upcoming", "Completed"] as const;

export const CampLocator = () => {
  const [district, setDistrict] = useState(districts[0]);
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [focused, setFocused] = useState<string>(camps[0].id);

  const visible = camps.filter((camp) => {
    const districtOk = district === districts[0] || camp.district === district;
    const stateOk = filter === "All" || stateLabel[camp.state] === filter;
    return districtOk && stateOk;
  });

  const active: Camp =
    visible.find((camp) => camp.id === focused) ?? visible[0] ?? camps[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_23rem]">
      {/* -------------------------------------------------------- Map surface */}
      <Panel
        bodyClassName="p-0"
        hint="Pins show where the departmental van is stationed."
        title="Camp map — Prayagraj & adjoining divisions"
      >
        <div className="relative h-80 overflow-hidden bg-[#e7edf5] sm:h-[26rem]">
          <div
            aria-hidden
            className="absolute inset-0 opacity-70 [background-image:linear-gradient(#c9d6e6_1px,transparent_1px),linear-gradient(90deg,#c9d6e6_1px,transparent_1px)] [background-size:38px_38px]"
          />
          {/* Stylised river + highway to make the plate read as a map */}
          <svg
            aria-hidden
            className="absolute inset-0 size-full"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <title>Schematic district map</title>
            <path
              d="M-2 62 C 18 54, 30 74, 48 66 S 78 44, 102 56"
              fill="none"
              stroke="#a8c4e0"
              strokeWidth="3.4"
            />
            <path
              d="M8 -2 C 22 28, 46 34, 58 58 S 74 92, 80 102"
              fill="none"
              stroke="#cfd9e6"
              strokeDasharray="3 2"
              strokeWidth="1.2"
            />
          </svg>

          {visible.map((camp) => {
            const pin = pins[camp.id];
            const isActive = camp.id === active.id;
            return (
              <button
                className="absolute -translate-x-1/2 -translate-y-full"
                key={camp.id}
                onClick={() => setFocused(camp.id)}
                style={{ top: pin.top, left: pin.left }}
                type="button"
              >
                <span
                  className={`flex flex-col items-center ${isActive ? "scale-110" : ""} transition-transform`}
                >
                  <span
                    className={`flex items-center gap-1 whitespace-nowrap rounded-gov border px-2 py-1 text-[10px] font-semibold shadow-sm ${
                      isActive
                        ? "border-navy bg-navy text-white"
                        : "border-line bg-white text-ink"
                    }`}
                  >
                    {camp.state === "active" ? (
                      <Radio className="size-3 text-emerald-400" aria-hidden />
                    ) : (
                      <MapPin className="size-3" aria-hidden />
                    )}
                    {camp.market}
                  </span>
                  <span
                    className={`size-2.5 rounded-full ring-3 ${
                      camp.state === "active"
                        ? "bg-emerald-500 ring-emerald-500/25"
                        : camp.state === "upcoming"
                          ? "bg-navy ring-navy/20"
                          : "bg-slate-400 ring-slate-400/25"
                    }`}
                  />
                </span>
              </button>
            );
          })}

          <div className="absolute bottom-3 left-3 rounded-gov border border-line bg-white/95 px-3 py-2 text-[10px] text-ink-muted">
            <p className="mb-1 font-semibold uppercase tracking-wide text-ink">
              Legend
            </p>
            <p className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" /> Active now
            </p>
            <p className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-navy" /> Upcoming
            </p>
            <p className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-slate-400" /> Completed
            </p>
          </div>
        </div>

        {/* Focused camp detail */}
        <div className="border-t border-line-soft p-4">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h3 className="text-base font-semibold text-ink">
                {active.market}
              </h3>
              <p className="mt-0.5 text-xs text-ink-muted">
                {active.district} · Van {active.van}
              </p>
            </div>
            <Badge tone={stateTone[active.state]}>
              {stateLabel[active.state]}
            </Badge>
          </div>

          <dl className="mt-3 grid gap-3 sm:grid-cols-3">
            <div className="rounded-gov bg-surface-alt p-3">
              <dt className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                <CalendarDays className="size-3.5" aria-hidden /> Date
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">
                {active.day}, {active.date}
              </dd>
            </div>
            <div className="rounded-gov bg-surface-alt p-3">
              <dt className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                <Clock3 className="size-3.5" aria-hidden /> Window
              </dt>
              <dd className="num mt-0.5 text-sm font-semibold text-ink">
                {active.window}
              </dd>
            </div>
            <div className="rounded-gov bg-surface-alt p-3">
              <dt className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                <UserRound className="size-3.5" aria-hidden /> Officer on duty
              </dt>
              <dd className="mt-0.5 text-sm font-semibold text-ink">
                {active.officer}
              </dd>
            </div>
          </dl>

          {active.state !== "upcoming" ? (
            <div className="mt-3">
              <div className="flex items-center justify-between text-[11px] text-ink-muted">
                <span>Instruments stamped at this camp</span>
                <span className="num font-semibold text-ink">
                  {active.done} / {active.target}
                </span>
              </div>
              <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-line-soft">
                <div
                  className="h-full rounded-full bg-india-green"
                  style={{
                    width: `${Math.min(100, Math.round((active.done / active.target) * 100))}%`,
                  }}
                />
              </div>
            </div>
          ) : null}
        </div>
      </Panel>

      {/* -------------------------------------------------------- Schedule list */}
      <div className="space-y-4">
        <Panel title="Filter camps">
          <Select
            onChange={(event) => setDistrict(event.target.value)}
            value={district}
          >
            {districts.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.map((item) => (
              <Chip
                active={filter === item}
                key={item}
                onClick={() => setFilter(item)}
              >
                {item}
              </Chip>
            ))}
          </div>
        </Panel>

        <Panel
          bodyClassName="divide-y divide-line-soft"
          hint={`${visible.length} camp(s) scheduled`}
          title="Weekly schedule"
        >
          {visible.map((camp) => (
            <button
              className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors first:pt-3 hover:bg-surface-alt ${
                camp.id === active.id ? "bg-navy/4" : ""
              }`}
              key={camp.id}
              onClick={() => setFocused(camp.id)}
              type="button"
            >
              <Truck
                className={`mt-0.5 size-4 shrink-0 ${
                  camp.state === "active"
                    ? "text-india-green"
                    : "text-ink-muted"
                }`}
                aria-hidden
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold text-ink">
                  {camp.day} · {camp.market}
                </span>
                <span className="num mt-0.5 block text-[11px] text-ink-muted">
                  {camp.date} · {camp.window}
                </span>
              </span>
              <Badge tone={stateTone[camp.state]}>
                {stateLabel[camp.state]}
              </Badge>
            </button>
          ))}
          {visible.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-ink-muted">
              No camps match this filter.
            </p>
          ) : null}
        </Panel>
      </div>
    </div>
  );
};
