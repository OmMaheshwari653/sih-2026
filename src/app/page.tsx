import Guidelines from "@/components/home/Guidelines";
import InstrumentDigitalPassport from "@/components/home/InstrumentDigitalPassport";
import QuickActions from "@/components/home/QuickActions";
import RecentApplications from "@/components/home/RecentApplications";
import StatsCards from "@/components/home/StatsCards";
import VerificationLifecycle from "@/components/home/VerificationLifecycle";
import VerifyCertificate from "@/components/home/VerifyCertificate";
import Footer from "@/components/shared/Footer";
import Navbar from "@/components/shared/Navbar";
import Sidebar from "@/components/shared/Sidebar";

export default function Page() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <div className="flex flex-1">
        <Sidebar />

        <main
          className="w-full min-w-0 flex-1 p-4 pb-20 sm:p-5 lg:pb-5"
          id="main-content"
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <h1 className="text-xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-xs text-slate-500">
                Welcome to Legal Metrology Online Verification System
              </p>
            </div>
            <p className="text-[11px] text-slate-500">
              Last Login: 20 May 2025, 11:30 AM
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="min-w-0 space-y-4">
              <StatsCards />
              <RecentApplications />
              <VerificationLifecycle />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Guidelines />
                <QuickActions />
              </div>
            </div>

            <div className="space-y-4">
              <VerifyCertificate />
              <InstrumentDigitalPassport />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
