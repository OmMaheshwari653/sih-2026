import { Suspense } from "react";
import { ReportWizard } from "@/components/public/ReportWizard";

export const metadata = { title: "Report a Faulty Scale" };

const ReportFraudPage = () => (
  <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
    <header className="mb-5">
      <h1 className="font-serif text-2xl font-bold text-ink">
        Report an under-weighing or tampered instrument
      </h1>
      <p className="mt-1 text-sm text-ink-muted">
        Filed under Section 25 of the Legal Metrology Act, 2009. Your identity
        is never disclosed to the trader.
      </p>
    </header>

    <Suspense fallback={null}>
      <ReportWizard />
    </Suspense>
  </div>
);

export default ReportFraudPage;
