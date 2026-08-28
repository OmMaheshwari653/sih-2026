import { CampMode } from "@/components/lmo/CampMode";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata = { title: "Camp Mode" };

const CampModePage = () => (
  <>
    <PageHeader
      crumbs={[
        { label: "Officer Portal", href: "/lmo/dashboard" },
        { label: "Camp mode" },
      ]}
      subtitle="Mundera Sabzi Mandi · Van UP70-LM-0114 · 62 of 90 stamped today"
      title="Express camp onboarding"
    />
    <CampMode />
  </>
);

export default CampModePage;
