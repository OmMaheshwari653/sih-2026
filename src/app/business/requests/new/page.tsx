import { SlotBooking } from "@/components/business/SlotBooking";
import { PageHeader } from "@/components/shared/PageHeader";

export const metadata = { title: "Book Verification Slot" };

const NewRequestPage = () => (
  <>
    <PageHeader
      crumbs={[
        { label: "Business Portal", href: "/business/dashboard" },
        { label: "Book verification" },
      ]}
      subtitle="Select instruments, pick an inspection window and pay the statutory fee."
      title="Verification slot & fee payment"
    />
    <SlotBooking />
  </>
);

export default NewRequestPage;
