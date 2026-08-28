import { PlusSquare } from "lucide-react";
import { InstrumentTable } from "@/components/business/InstrumentTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { ButtonLink } from "@/components/ui/Button";

export const metadata = { title: "My Instruments" };

const InstrumentsPage = () => (
  <>
    <PageHeader
      action={
        <ButtonLink href="/business/instruments/register" size="sm">
          <PlusSquare className="size-4" aria-hidden />
          Register new instrument
        </ButtonLink>
      }
      crumbs={[
        { label: "Business Portal", href: "/business/dashboard" },
        { label: "My Instruments" },
      ]}
      subtitle="Every weighing and measuring device registered against ABC Traders."
      title="Instrument fleet"
    />

    <InstrumentTable />
  </>
);

export default InstrumentsPage;
