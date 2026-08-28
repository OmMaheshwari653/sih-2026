import { CertificateVault } from "@/components/business/CertificateVault";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata = { title: "Certificate Vault" };

const CertificatesPage = () => (
  <>
    <PageHeader
      crumbs={[
        { label: "Business Portal", href: "/business/dashboard" },
        { label: "Certificate vault" },
      ]}
      subtitle="Every verification certificate issued to ABC Traders, with printable QR seals."
      title="Digital certificate vault"
    />
    <CertificateVault />
  </>
);

export default CertificatesPage;
