import { InspectionWorkspace } from "@/components/lmo/InspectionWorkspace";
import { PageHeader } from "@/components/shared/PageHeader";
import { inspectionById } from "@/lib/data";

export const metadata = { title: "Field Verification" };

export default async function InspectionPage({
  params,
}: PageProps<"/lmo/inspections/[id]">) {
  const { id } = await params;
  const inspection = inspectionById(decodeURIComponent(id));

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Officer Portal", href: "/lmo/dashboard" },
          { label: "Today's route", href: "/lmo/dashboard" },
          { label: inspection.id },
        ]}
        subtitle={`${inspection.business} · ${inspection.address}`}
        title="Field verification workspace"
      />
      <InspectionWorkspace inspection={inspection} />
    </>
  );
}
