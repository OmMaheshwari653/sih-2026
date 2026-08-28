"use client";

import { Download, Gavel, Radio, Send } from "lucide-react";
import { useState } from "react";
import { Badge, type Tone } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip, Select } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { StatTile } from "@/components/ui/StatTile";
import { TableWrap, Tbody, Td, Thead } from "@/components/ui/Table";
import { challans, rupees } from "@/lib/data";

const stateTone: Record<string, Tone> = {
  "Notice Dispatched": "blue",
  "Pending Payment": "amber",
  "Escalated to Court": "red",
};

const states = [
  "All",
  "Notice Dispatched",
  "Pending Payment",
  "Escalated to Court",
];
const districts = [
  "All districts",
  ...new Set(challans.map((item) => item.district)),
];

/** Compounding slab widens with how long the instrument stayed unverified. */
const slab = (days: number) =>
  days > 90
    ? "Slab III (>90 days)"
    : days > 60
      ? "Slab II (61–90)"
      : "Slab I (31–60)";

export const ChallanFeed = () => {
  const [state, setState] = useState("All");
  const [district, setDistrict] = useState(districts[0]);

  const rows = challans.filter(
    (challan) =>
      (state === "All" || challan.state === state) &&
      (district === districts[0] || challan.district === district),
  );

  const total = rows.reduce((sum, challan) => sum + challan.fine, 0);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <StatTile
          footnote="Across all districts this month"
          icon={Gavel}
          label="Challans generated"
          tone="navy"
          value="4,118"
        />
        <StatTile
          footnote="Realised out of ₹3.86 Cr assessed"
          icon={Gavel}
          label="Compounding fees realised"
          tone="green"
          value="₹1.42 Cr"
        />
        <StatTile
          footnote="Non-payment beyond 60 days of notice"
          icon={Gavel}
          label="Escalated to court"
          tone="red"
          value={214}
        />
      </div>

      <Panel>
        <div className="flex flex-wrap items-center gap-3">
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-300 bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-800">
            <Radio className="size-3" aria-hidden />
            Live feed
          </span>
          <Select
            className="w-auto"
            onChange={(event) => setDistrict(event.target.value)}
            value={district}
          >
            {districts.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <div className="flex flex-wrap gap-2">
            {states.map((item) => (
              <Chip
                active={state === item}
                key={item}
                onClick={() => setState(item)}
              >
                {item}
              </Chip>
            ))}
          </div>
        </div>
      </Panel>

      <Panel
        action={
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">
              <Download className="size-3.5" aria-hidden />
              Export
            </Button>
            <Button size="sm">
              <Send className="size-3.5" aria-hidden />
              Dispatch pending notices
            </Button>
          </div>
        }
        bodyClassName=""
        hint={`${rows.length} challans · ${rupees(total)} assessed`}
        title="Challan register"
      >
        <TableWrap minWidth="min-w-4xl">
          <Thead
            columns={[
              "Challan no.",
              "Trader",
              "District",
              "Instrument",
              "Overdue",
              "Slab",
              "Fine",
              "Status",
            ]}
          />
          <Tbody>
            {rows.map((challan) => (
              <tr className="hover:bg-surface-alt" key={challan.id}>
                <Td className="num font-semibold text-ink">{challan.id}</Td>
                <Td>{challan.trader}</Td>
                <Td className="text-ink-muted">{challan.district}</Td>
                <Td className="num text-ink-muted">{challan.instrument}</Td>
                <Td>
                  <span
                    className={`num font-semibold ${challan.overdueDays > 90 ? "text-red-700" : "text-amber-700"}`}
                  >
                    {challan.overdueDays} days
                  </span>
                </Td>
                <Td className="text-ink-muted">{slab(challan.overdueDays)}</Td>
                <Td className="num font-semibold">{rupees(challan.fine)}</Td>
                <Td>
                  <Badge tone={stateTone[challan.state]}>{challan.state}</Badge>
                </Td>
              </tr>
            ))}
          </Tbody>
        </TableWrap>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-ink-muted">
            No challans match this filter.
          </p>
        ) : null}
      </Panel>

      <p className="text-[11px] leading-4 text-ink-muted">
        Challans are computed from the register, not from an inspection — a
        trader who renews before the notice is served has the challan withdrawn
        automatically. Compounding is offered under Section 48 before
        prosecution is initiated.
      </p>
    </div>
  );
};
