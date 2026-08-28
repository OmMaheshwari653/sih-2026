import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { TableWrap, Tbody, Td, Thead } from "@/components/ui/Table";
import { applications, rupees } from "@/lib/data";

const columns = [
  "Application ID",
  "Instrument",
  "Nature of request",
  "Filed on",
  "Fee",
  "Status",
  "Next action",
];

const RecentApplications = () => (
  <Panel
    action={
      <Link
        className="inline-flex items-center gap-1 text-xs font-semibold text-navy-500 hover:underline"
        href="/business/instruments"
      >
        View all applications
        <ArrowRight className="size-3.5" aria-hidden />
      </Link>
    }
    bodyClassName=""
    hint="Requests filed against your registered instruments"
    title="Recent applications"
  >
    <TableWrap minWidth="min-w-4xl">
      <Thead columns={columns} />
      <Tbody>
        {applications.map((application) => (
          <tr className="hover:bg-surface-alt" key={application.id}>
            <Td className="num font-semibold text-ink">{application.id}</Td>
            <Td>
              <span className="block font-medium text-ink">
                {application.instrument}
              </span>
              <span className="num block text-[11px] text-ink-muted">
                {application.instrumentId}
              </span>
            </Td>
            <Td className="text-ink-muted">{application.type}</Td>
            <Td className="num text-ink-muted">{application.filedOn}</Td>
            <Td className="num">{rupees(application.fee)}</Td>
            <Td>
              <StatusBadge status={application.status} />
            </Td>
            <Td className="max-w-64 text-ink-muted">
              {application.nextAction}
            </Td>
          </tr>
        ))}
      </Tbody>
    </TableWrap>
  </Panel>
);

export default RecentApplications;
