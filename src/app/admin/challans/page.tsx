import { ChallanFeed } from "@/components/admin/ChallanFeed";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata = { title: "E-Challan Feed" };

const ChallansPage = () => (
  <>
    <PageHeader
      crumbs={[
        { label: "Command Centre", href: "/admin/dashboard" },
        { label: "E-challans" },
      ]}
      subtitle="Penalties raised automatically once an instrument crosses 30 days past validity."
      title="Automated e-challan feed"
    />
    <ChallanFeed />
  </>
);

export default ChallansPage;
