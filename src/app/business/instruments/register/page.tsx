import { RegisterWizard } from "@/components/business/RegisterWizard";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata = { title: "Register Instrument" };

const RegisterInstrumentPage = () => (
  <>
    <PageHeader
      crumbs={[
        { label: "Business Portal", href: "/business/dashboard" },
        { label: "My Instruments", href: "/business/instruments" },
        { label: "Register" },
      ]}
      subtitle="Declare a new weighing or measuring instrument before it is put to trade use."
      title="Instrument onboarding"
    />
    <RegisterWizard />
  </>
);

export default RegisterInstrumentPage;
