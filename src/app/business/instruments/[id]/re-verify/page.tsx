import { ReVerifyForm } from "@/components/business/ReVerifyForm";
import { PageHeader } from "@/components/shared/PageHeader";
import { instrumentById } from "@/lib/data";

export const metadata = { title: "Request Re-verification" };

export default async function ReVerifyPage({
  params,
}: PageProps<"/business/instruments/[id]/re-verify">) {
  const { id } = await params;
  const instrument = instrumentById(decodeURIComponent(id));

  return (
    <>
      <PageHeader
        crumbs={[
          { label: "Business Portal", href: "/business/dashboard" },
          { label: "My Instruments", href: "/business/instruments" },
          { label: "Re-verification" },
        ]}
        subtitle={`${instrument.name} · ${instrument.id}`}
        title="Request re-verification"
      />
      <ReVerifyForm instrument={instrument} />
    </>
  );
}
