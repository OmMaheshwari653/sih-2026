"use client";

import { Download, Fingerprint, Search } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Chip, Input, Select } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { TableWrap, Tbody, Td, Thead } from "@/components/ui/Table";

type Outcome = "Verified" | "Rejected" | "Seal replaced" | "Camp stamping";

const log: {
  id: string;
  date: string;
  business: string;
  instrument: string;
  outcome: Outcome;
  remark: string;
  hash: string;
}[] = [
  {
    id: "INS-2025-4402",
    date: "20 May 2025, 15:12",
    business: "ABC Traders",
    instrument: "LM-UP-PRY-000128",
    outcome: "Verified",
    remark: "All loads within MPE. Seal QR-UP-2025-77098 bound.",
    hash: "1b77:9e04",
  },
  {
    id: "INS-2025-4398",
    date: "20 May 2025, 11:47",
    business: "Mundera Stall 44",
    instrument: "LM-UP-PRY-004812",
    outcome: "Camp stamping",
    remark: "Express camp onboarding, ₹120 cash receipt 00412.",
    hash: "cc31:2a90",
  },
  {
    id: "INS-2025-4390",
    date: "02 Feb 2025, 13:26",
    business: "Shree Gold Jewellers",
    instrument: "LM-UP-PRY-000127",
    outcome: "Rejected",
    remark: "+0.9 g at 200 g against MPE ±0.5 g. Load cell drift.",
    hash: "77a1:3c0f",
  },
  {
    id: "INS-2025-4371",
    date: "18 Jan 2025, 09:58",
    business: "Bharat Petroleum GT Road",
    instrument: "LM-UP-PRY-000125",
    outcome: "Seal replaced",
    remark: "Seal QR-UP-2024-30211 scrapped after nozzle service.",
    hash: "c40e:81bb",
  },
  {
    id: "INS-2024-4188",
    date: "03 Sep 2024, 10:15",
    business: "ABC Traders",
    instrument: "LM-UP-PRY-000124",
    outcome: "Verified",
    remark: "Platform scale, corner load test satisfactory.",
    hash: "9f2c:4ae1",
  },
];

const outcomeTone = {
  Verified: "green",
  Rejected: "red",
  "Seal replaced": "amber",
  "Camp stamping": "blue",
} as const;

const filters = [
  "All",
  "Verified",
  "Rejected",
  "Seal replaced",
  "Camp stamping",
] as const;

export const AuditHistory = () => {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [period, setPeriod] = useState("Last 12 months");

  const rows = log.filter((entry) => {
    if (filter !== "All" && entry.outcome !== filter) return false;
    const haystack =
      `${entry.id} ${entry.business} ${entry.instrument}`.toLowerCase();
    return !query || haystack.includes(query.toLowerCase());
  });

  return (
    <div className="space-y-4">
      <Panel>
        <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
          <div className="flex items-center gap-2 rounded-gov border border-line px-3 focus-within:border-navy-500">
            <Search className="size-4 shrink-0 text-ink-muted" aria-hidden />
            <Input
              className="border-0 px-0"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by inspection ID, business or instrument"
              value={query}
            />
          </div>
          <Select
            onChange={(event) => setPeriod(event.target.value)}
            value={period}
          >
            <option>Last 30 days</option>
            <option>Last 6 months</option>
            <option>Last 12 months</option>
            <option>Financial year 2024–25</option>
          </Select>
        </div>
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
        action={
          <Button size="sm" variant="secondary">
            <Download className="size-3.5" aria-hidden />
            Export signed CSV
          </Button>
        }
        bodyClassName=""
        hint={`${rows.length} entries · ${period}`}
        title="Inspection archive"
      >
        <TableWrap minWidth="min-w-4xl">
          <Thead
            columns={[
              "Inspection",
              "Date & time",
              "Establishment",
              "Instrument",
              "Outcome",
              "Officer remark",
              "Record hash",
            ]}
          />
          <Tbody>
            {rows.map((entry) => (
              <tr className="hover:bg-surface-alt" key={entry.id}>
                <Td className="num font-semibold text-ink">{entry.id}</Td>
                <Td className="num text-ink-muted">{entry.date}</Td>
                <Td>{entry.business}</Td>
                <Td className="num text-ink-muted">{entry.instrument}</Td>
                <Td>
                  <Badge tone={outcomeTone[entry.outcome]}>
                    {entry.outcome}
                  </Badge>
                </Td>
                <Td className="max-w-72 text-ink-muted">{entry.remark}</Td>
                <Td>
                  <span className="num flex items-center gap-1 text-[11px] text-ink-muted">
                    <Fingerprint className="size-3 text-navy" aria-hidden />
                    {entry.hash}
                  </span>
                </Td>
              </tr>
            ))}
          </Tbody>
        </TableWrap>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-ink-muted">
            No entries match this filter.
          </p>
        ) : null}
      </Panel>

      <p className="text-[11px] leading-4 text-ink-muted">
        Entries cannot be edited or deleted. Any correction is recorded as a new
        entry referencing the original, so the chain of custody stays intact for
        departmental and CAG audit.
      </p>
    </div>
  );
};
