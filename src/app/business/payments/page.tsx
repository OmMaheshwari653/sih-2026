import { Download, ReceiptIndianRupee } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Badge } from "@/components/ui/Badge";
import { ButtonLink } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { StatTile } from "@/components/ui/StatTile";
import { TableWrap, Tbody, Td, Thead } from "@/components/ui/Table";
import { rupees } from "@/lib/data";

export const metadata = { title: "Payments" };

const ledger = [
  {
    id: "BK/2025/558102",
    against: "APP2025001187 · Platform Scale",
    date: "15 May 2025",
    mode: "UPI",
    amount: 1150,
    state: "Paid",
  },
  {
    id: "BK/2025/557914",
    against: "APP2025001102 · Fuel Dispenser",
    date: "10 May 2025",
    mode: "Net banking",
    amount: 2400,
    state: "Paid",
  },
  {
    id: "—",
    against: "APP2025001245 · Digital Weighing Scale",
    date: "Due 24 May 2025",
    mode: "Not paid",
    amount: 240,
    state: "Pending",
  },
  {
    id: "—",
    against: "ECH/UP/2025/11207 · Compounding fee",
    date: "Due 30 May 2025",
    mode: "Not paid",
    amount: 12000,
    state: "Pending",
  },
  {
    id: "BK/2025/551880",
    against: "APP2025000987 · Bench Scale",
    date: "05 May 2025",
    mode: "UPI",
    amount: 300,
    state: "Paid",
  },
];

const PaymentsPage = () => (
  <>
    <PageHeader
      crumbs={[
        { label: "Business Portal", href: "/business/dashboard" },
        { label: "Payments" },
      ]}
      subtitle="Verification fees, late fees and compounding charges routed through Bharatkosh."
      title="Payments & receipts"
    />

    <div className="grid gap-4 sm:grid-cols-3">
      <StatTile
        icon={ReceiptIndianRupee}
        label="Paid this financial year"
        tone="green"
        value={rupees(3850)}
      />
      <StatTile
        footnote="2 items awaiting payment"
        icon={ReceiptIndianRupee}
        label="Currently payable"
        tone="amber"
        value={rupees(12240)}
      />
      <StatTile
        footnote="Compounding fee for a rejected instrument"
        icon={ReceiptIndianRupee}
        label="Penalty component"
        tone="red"
        value={rupees(12000)}
      />
    </div>

    <div className="mt-4">
      <Panel
        action={
          <ButtonLink href="/business/requests/new" size="sm">
            Pay pending dues
          </ButtonLink>
        }
        bodyClassName=""
        title="Transaction ledger"
      >
        <TableWrap minWidth="min-w-3xl">
          <Thead
            columns={[
              "Receipt no.",
              "Against",
              "Date",
              "Mode",
              "Amount",
              "Status",
              "",
            ]}
          />
          <Tbody>
            {ledger.map((row) => (
              <tr className="hover:bg-surface-alt" key={row.against}>
                <Td className="num font-semibold text-ink">{row.id}</Td>
                <Td className="text-ink-muted">{row.against}</Td>
                <Td className="num text-ink-muted">{row.date}</Td>
                <Td className="text-ink-muted">{row.mode}</Td>
                <Td className="num font-semibold">{rupees(row.amount)}</Td>
                <Td>
                  <Badge tone={row.state === "Paid" ? "green" : "amber"}>
                    {row.state}
                  </Badge>
                </Td>
                <Td>
                  {row.state === "Paid" ? (
                    <button
                      className="inline-flex items-center gap-1 text-[11px] font-semibold text-navy-500 hover:underline"
                      type="button"
                    >
                      <Download className="size-3" aria-hidden />
                      Receipt
                    </button>
                  ) : (
                    <span className="text-[11px] text-ink-muted">—</span>
                  )}
                </Td>
              </tr>
            ))}
          </Tbody>
        </TableWrap>
      </Panel>
    </div>
  </>
);

export default PaymentsPage;
