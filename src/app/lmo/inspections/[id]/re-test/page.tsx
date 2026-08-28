import { ReTestWorkspace } from "@/components/lmo/ReTestWorkspace";
import { PageHeader } from "@/components/shared/PageHeader";
import { inspectionById } from "@/lib/data";

export const metadata = { title: "Re-inspection" };

export default async function ReTestPage({
  params,
}: PageProps<"/lmo/inspections/[id]/re-test">) {
  const { id } = await params;
  const inspection = inspectionById(decodeURIComponent(id));

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Officer Portal", href: "/lmo/dashboard" },
          { label: inspection.id, href: `/lmo/inspections/${inspection.id}` },
          { label: "Re-test" },
        ]}
        subtitle={`${inspection.business} · previously rejected instrument`}
        title="Re-inspection & seal replacement"
      />
      <ReTestWorkspace inspection={inspection} />
    </>
  );
}
