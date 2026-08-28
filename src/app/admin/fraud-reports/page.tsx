import { FraudTriage } from "@/components/admin/FraudTriage";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata = { title: "Fraud Triage" };

const FraudReportsPage = () => (
  <>
    <PageHeader
      crumbs={[
        { label: "Command Centre", href: "/admin/dashboard" },
        { label: "Fraud triage" },
      ]}
      subtitle="Citizen complaints, clustered by locality and ranked by severity."
      title="Whistleblower triage"
    />
    <FraudTriage />
  </>
);

export default FraudReportsPage;
