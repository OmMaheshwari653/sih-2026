import { AuditHistory } from "@/components/lmo/AuditHistory";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata = { title: "Audit History" };

const HistoryPage = () => (
  <>
    <PageHeader
      crumbs={[
        { label: "Officer Portal", href: "/lmo/dashboard" },
        { label: "Audit history" },
      ]}
      subtitle="Append-only log of every stamping, rejection and seal action signed with your officer ID."
      title="Audit log & past inspections"
    />
    <AuditHistory />
  </>
);

export default HistoryPage;
