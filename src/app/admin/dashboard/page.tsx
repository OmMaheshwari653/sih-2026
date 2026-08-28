import {
  BadgeIndianRupee,
  Building2,
  Scale,
  ShieldAlert,
  TrendingUp,
} from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { StatTile } from "@/components/ui/StatTile";
import { TableWrap, Tbody, Td, Thead } from "@/components/ui/Table";
import { districtCompliance, rupees } from "@/lib/data";

export const metadata = { title: "State Command Centre" };

const revenue = [
  { month: "Dec", collected: 412, pending: 96 },
  { month: "Jan", collected: 468, pending: 104 },
  { month: "Feb", collected: 502, pending: 88 },
  { month: "Mar", collected: 611, pending: 142 },
  { month: "Apr", collected: 524, pending: 121 },
  { month: "May", collected: 389, pending: 168 },
];

const officers = [
  {
    name: "Sh. Anil Verma",
    circle: "Prayagraj — Sadar",
    perDay: 11.4,
    rejection: 6.2,
    camps: 8,
  },
  {
    name: "Smt. Kavita Rao",
    circle: "Prayagraj — Naini",
    perDay: 9.8,
    rejection: 9.1,
    camps: 5,
  },
  {
    name: "Sh. Dinesh Pal",
    circle: "Kanpur — Govind Nagar",
    perDay: 12.6,
    rejection: 2.1,
    camps: 11,
  },
  {
    name: "Sh. Faizan Ahmad",
    circle: "Lucknow — Aminabad",
    perDay: 8.2,
    rejection: 7.4,
    camps: 6,
  },
  {
    name: "Sh. Ramesh Yadav",
    circle: "Prayagraj — Katra",
    perDay: 6.9,
    rejection: 1.2,
    camps: 3,
  },
];

const heatTone = (rate: number) =>
  rate >= 88
    ? "bg-emerald-600 text-white"
    : rate >= 80
      ? "bg-emerald-400 text-emerald-950"
      : rate >= 72
        ? "bg-amber-300 text-amber-950"
        : rate >= 66
          ? "bg-orange-400 text-orange-950"
          : "bg-red-500 text-white";

const maxRevenue = Math.max(
  ...revenue.map((item) => item.collected + item.pending),
);

const AdminDashboardPage = () => (
  <>
    <PageHeader
      action={
        <p className="num text-[11px] text-ink-muted">
          Data as on 20 May 2025, 18:00 IST
        </p>
      }
      crumbs={[
        { label: "Command Centre", href: "/admin/dashboard" },
        { label: "Analytics" },
      ]}
      subtitle="Legal Metrology, Uttar Pradesh · 75 districts · 412 field officers"
      title="State command analytics"
    />

    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <StatTile
        footnote="Instruments on the state register"
        icon={Scale}
        label="Registered instruments"
        tone="navy"
        value="3,56,300"
      />
      <StatTile
        footnote="Weighted across all districts"
        icon={TrendingUp}
        label="Compliance rate"
        tone="green"
        value="79.8%"
      />
      <StatTile
        footnote="Verification fees, FY 2024–25"
        icon={BadgeIndianRupee}
        label="Revenue collected"
        tone="sky"
        value="₹29.06 Cr"
      />
      <StatTile
        footnote="Open citizen complaints"
        icon={ShieldAlert}
        label="Fraud reports"
        tone="red"
        value={1284}
      />
    </div>

    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)]">
      {/* ------------------------------------------------------- Heat map */}
      <Panel
        action={
          <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">
            <span>Low</span>
            {[
              "bg-red-500",
              "bg-orange-400",
              "bg-amber-300",
              "bg-emerald-400",
              "bg-emerald-600",
            ].map((tone) => (
              <span className={`size-3 rounded-[2px] ${tone}`} key={tone} />
            ))}
            <span>High</span>
          </div>
        }
        hint="Share of registered instruments holding a valid stamping"
        title="District compliance heat-map"
      >
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {districtCompliance.map((district) => (
            <article
              className={`rounded-gov p-3 ${heatTone(district.rate)}`}
              key={district.district}
            >
              <p className="num text-xl font-bold leading-none">
                {district.rate}%
              </p>
              <p className="mt-1 text-[11px] font-semibold leading-tight">
                {district.district}
              </p>
              <p className="num mt-1.5 text-[10px] opacity-85">
                {district.pending.toLocaleString("en-IN")} pending
              </p>
            </article>
          ))}
        </div>

        <p className="mt-3 text-[11px] leading-4 text-ink-muted">
          Bareilly (63%) and Gorakhpur (69%) are the two districts below the
          state floor of 70%. Both have fewer than four officers per lakh
          instruments — an additional van has been sanctioned for each.
        </p>
      </Panel>

      {/* -------------------------------------------------------- Revenue */}
      <Panel
        hint="Fees realised against fees assessed (₹ lakh)"
        title="Revenue collected vs pending"
      >
        <div className="flex h-52 items-end gap-3">
          {revenue.map((month) => {
            const collectedPct = (month.collected / maxRevenue) * 100;
            const pendingPct = (month.pending / maxRevenue) * 100;
            return (
              <div
                className="flex flex-1 flex-col items-center gap-1.5"
                key={month.month}
              >
                <div className="flex h-full w-full flex-col justify-end gap-0.5">
                  <div
                    className="w-full rounded-t-[2px] bg-amber-300"
                    style={{ height: `${pendingPct}%` }}
                    title={`Pending ₹${month.pending} lakh`}
                  />
                  <div
                    className="w-full bg-navy"
                    style={{ height: `${collectedPct}%` }}
                    title={`Collected ₹${month.collected} lakh`}
                  />
                </div>
                <span className="text-[10px] text-ink-muted">
                  {month.month}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-4 border-t border-line-soft pt-3 text-[11px] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-navy" /> Collected
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-[2px] bg-amber-300" /> Pending
          </span>
          <span className="num ml-auto font-semibold text-ink">
            May shortfall {rupees(16800000)}
          </span>
        </div>
      </Panel>
    </div>

    {/* --------------------------------------------------- Officer metrics */}
    <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
      <Panel
        bodyClassName=""
        hint="Rolling 30-day averages · flagged where the pattern needs review"
        title="Officer productivity"
      >
        <TableWrap minWidth="min-w-3xl">
          <Thead
            columns={[
              "Officer",
              "Circle",
              "Inspections / day",
              "Rejection ratio",
              "Camps held",
              "Review",
            ]}
          />
          <Tbody>
            {officers.map((officer) => {
              const outlier = officer.rejection < 2.5 || officer.perDay < 7;
              return (
                <tr className="hover:bg-surface-alt" key={officer.name}>
                  <Td className="font-medium text-ink">{officer.name}</Td>
                  <Td className="text-ink-muted">{officer.circle}</Td>
                  <Td className="num">{officer.perDay}</Td>
                  <Td className="num">{officer.rejection}%</Td>
                  <Td className="num">{officer.camps}</Td>
                  <Td>
                    <Badge tone={outlier ? "amber" : "green"}>
                      {outlier ? "Flagged" : "Normal"}
                    </Badge>
                  </Td>
                </tr>
              );
            })}
          </Tbody>
        </TableWrap>
        <p className="px-4 py-3 text-[11px] leading-4 text-ink-muted">
          A rejection ratio far below the state mean (5.9%) alongside a high
          inspection count is treated as a signal for supervisory audit — it is
          the pattern that historically accompanied desk-issued certificates.
        </p>
      </Panel>

      <Panel title="Enforcement snapshot">
        <dl className="space-y-3">
          {[
            {
              label: "E-challans generated this month",
              value: "4,118",
              icon: Building2,
            },
            {
              label: "Compounding fees realised",
              value: "₹1.42 Cr",
              icon: BadgeIndianRupee,
            },
            {
              label: "Surprise raids ordered",
              value: "312",
              icon: ShieldAlert,
            },
            { label: "Instruments condemned", value: "886", icon: Scale },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                className="flex items-center gap-3 rounded-gov bg-surface-alt p-3"
                key={item.label}
              >
                <Icon className="size-4.5 shrink-0 text-navy" aria-hidden />
                <dt className="flex-1 text-[12px] text-ink-muted">
                  {item.label}
                </dt>
                <dd className="num text-sm font-bold text-ink">{item.value}</dd>
              </div>
            );
          })}
        </dl>
      </Panel>
    </div>
  </>
);

export default AdminDashboardPage;
