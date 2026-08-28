"use client";

import { FileCheck2, QrCode, RotateCcw, Search } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { StatusBadge } from "@/components/ui/Badge";
import { Chip, Input, Select } from "@/components/ui/Field";
import { Panel } from "@/components/ui/Panel";
import { TableWrap, Tbody, Td, Thead } from "@/components/ui/Table";
import { instruments } from "@/lib/data";

const columns = [
  "Instrument ID",
  "Device",
  "Class / Capacity",
  "Deployment",
  "Last stamped",
  "Valid till",
  "Status",
  "Actions",
];

const categories = [
  "All types",
  "Weighing",
  "Measuring",
  "Dispensing",
] as const;
const statuses = [
  "All",
  "Valid",
  "Expiring Soon",
  "Expired",
  "Rejected",
] as const;
const locations = [
  "All locations",
  ...new Set(instruments.map((item) => item.location)),
];

export const InstrumentTable = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState<(typeof categories)[number]>("All types");
  const [status, setStatus] = useState<(typeof statuses)[number]>("All");
  const [location, setLocation] = useState(locations[0]);

  const rows = instruments.filter((item) => {
    const haystack =
      `${item.id} ${item.name} ${item.serial} ${item.make} ${item.model}`.toLowerCase();
    if (query && !haystack.includes(query.toLowerCase())) return false;
    if (category !== "All types" && item.category !== category) return false;
    if (location !== locations[0] && item.location !== location) return false;
    if (status === "All") return true;
    return (
      (status === "Valid" && item.status === "valid") ||
      (status === "Expiring Soon" && item.status === "expiring") ||
      (status === "Expired" && item.status === "expired") ||
      (status === "Rejected" && item.status === "rejected")
    );
  });

  return (
    <div className="space-y-4">
      <Panel>
        <div className="grid gap-3 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div className="flex items-center gap-2 rounded-gov border border-line px-3 focus-within:border-navy-500">
            <Search className="size-4 shrink-0 text-ink-muted" aria-hidden />
            <Input
              className="border-0 px-0 focus:border-0"
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by ID, serial, make or model"
              value={query}
            />
          </div>
          <Select
            onChange={(event) => setLocation(event.target.value)}
            value={location}
          >
            {locations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
          <Select
            onChange={(event) =>
              setCategory(event.target.value as (typeof categories)[number])
            }
            value={category}
          >
            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </Select>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {statuses.map((item) => (
            <Chip
              active={status === item}
              key={item}
              onClick={() => setStatus(item)}
            >
              {item}
            </Chip>
          ))}
        </div>
      </Panel>

      <Panel
        bodyClassName=""
        hint={`${rows.length} of ${instruments.length} instruments`}
        title="Registered instruments"
      >
        <TableWrap minWidth="min-w-5xl">
          <Thead columns={columns} />
          <Tbody>
            {rows.map((item) => (
              <tr className="hover:bg-surface-alt" key={item.id}>
                <Td className="num font-semibold text-ink">{item.id}</Td>
                <Td>
                  <span className="block font-medium text-ink">
                    {item.name}
                  </span>
                  <span className="num block text-[11px] text-ink-muted">
                    {item.make} {item.model} · {item.serial}
                  </span>
                </Td>
                <Td className="text-ink-muted">
                  <span className="block">{item.accuracyClass}</span>
                  <span className="num block text-[11px]">{item.capacity}</span>
                </Td>
                <Td className="max-w-52 text-ink-muted">{item.location}</Td>
                <Td className="num text-ink-muted">{item.stampedOn}</Td>
                <Td className="num">{item.validTill}</Td>
                <Td>
                  <StatusBadge status={item.status} />
                </Td>
                <Td>
                  <div className="flex items-center gap-1.5">
                    <Link
                      aria-label="Download QR seal"
                      className="rounded-gov border border-line p-1.5 text-ink-muted hover:border-navy hover:text-navy"
                      href="/business/certificates"
                      title="Download QR seal"
                    >
                      <QrCode className="size-3.5" aria-hidden />
                    </Link>
                    <Link
                      aria-label="View certificate"
                      className="rounded-gov border border-line p-1.5 text-ink-muted hover:border-navy hover:text-navy"
                      href="/business/certificates"
                      title="View certificate"
                    >
                      <FileCheck2 className="size-3.5" aria-hidden />
                    </Link>
                    <Link
                      aria-label="Request re-verification"
                      className="rounded-gov border border-line p-1.5 text-ink-muted hover:border-navy hover:text-navy"
                      href={`/business/instruments/${item.id}/re-verify`}
                      title="Request re-verification"
                    >
                      <RotateCcw className="size-3.5" aria-hidden />
                    </Link>
                  </div>
                </Td>
              </tr>
            ))}
          </Tbody>
        </TableWrap>

        {rows.length === 0 ? (
          <p className="px-4 py-8 text-center text-xs text-ink-muted">
            No instruments match these filters.
          </p>
        ) : null}
      </Panel>
    </div>
  );
};
