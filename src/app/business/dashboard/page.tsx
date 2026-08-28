import {
  CircleAlert,
  CircleCheckBig,
  Clock,
  FileStack,
  Scale,
  TriangleAlert,
} from "lucide-react";
import Link from "next/link";
import InstrumentDigitalPassport from "@/components/dashboard/InstrumentDigitalPassport";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentApplications from "@/components/dashboard/RecentApplications";
import VerificationLifecycle from "@/components/dashboard/VerificationLifecycle";
import VerifyCertificate from "@/components/dashboard/VerifyCertificate";
import { PageHeader } from "@/components/shared/PageHeader";
import { Panel } from "@/components/ui/Panel";
import { StatTile } from "@/components/ui/StatTile";

export const metadata = { title: "Compliance Command Centre" };

const guidelines = [
  { label: "Legal Metrology Act, 2009", href: "/#rights" },
  { label: "Legal Metrology (General) Rules, 2011", href: "/#rights" },
  { label: "Verification fee schedule (S.O. 1142/2025)", href: "/#rights" },
  { label: "User manual for traders", href: "/#rights" },
];

const BusinessDashboardPage = () => (
  <>
    <PageHeader
      action={
        <p className="num text-[11px] text-ink-muted">
          Last login: 20 May 2025, 11:30 AM · IP 103.21.58.14
        </p>
      }
      crumbs={[
        { label: "Business Portal", href: "/business/dashboard" },
        { label: "Dashboard" },
      ]}
      subtitle="ABC Traders · GSTIN 09AABCA1234F1Z5 · Prayagraj"
      title="Compliance Command Centre"
    />

    <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1fr)_20rem]">
      {/* Verify box leads on phones — it is the most-used action at a counter */}
      <div className="order-1 xl:order-none xl:col-start-2 xl:row-start-1">
        <VerifyCertificate />
      </div>

      <div className="order-2 min-w-0 space-y-4 xl:order-none xl:col-start-1 xl:row-span-2 xl:row-start-1">
        {/* Non-compliance banner */}
        <div className="flex flex-wrap items-start gap-3 rounded-gov border-l-4 border-l-red-600 border-y border-r border-line bg-red-50/60 p-4">
          <TriangleAlert
            className="mt-0.5 size-5 shrink-0 text-red-700"
            aria-hidden
          />
          <div className="min-w-0 flex-1">
            <h2 className="text-sm font-semibold text-red-900">
              2 instruments are not fit for trade right now
            </h2>
            <p className="mt-0.5 text-[13px] leading-5 text-red-900/80">
              Milk Fat Meter (LM-UP-PRY-000126) expired on 27 Apr 2025 and the
              Precision Jewellery Balance (LM-UP-PRY-000127) was rejected for
              error beyond MPE. Both are publicly flagged to consumers scanning
              their QR stickers.
            </p>
          </div>
          <Link
            className="rounded-gov bg-red-700 px-4 py-2.5 text-xs font-semibold text-white hover:bg-red-800"
            href="/business/requests/new"
          >
            Schedule inspection
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
          <StatTile
            href="/business/instruments"
            icon={Scale}
            label="Registered instruments"
            tone="navy"
            value={12}
          />
          <StatTile
            href="/business/instruments"
            icon={CircleCheckBig}
            label="Valid & in service"
            tone="green"
            value={9}
          />
          <StatTile
            href="/business/instruments"
            icon={Clock}
            label="Expiring in 30 days"
            tone="amber"
            value={2}
          />
          <StatTile
            href="/business/instruments"
            icon={CircleAlert}
            label="Expired / rejected"
            tone="red"
            value={2}
          />
          <StatTile
            href="/business/certificates"
            icon={FileStack}
            label="Open applications"
            tone="violet"
            value={4}
          />
        </div>

        <RecentApplications />
        <VerificationLifecycle />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Panel
            className="relative overflow-hidden"
            title="Statutory references"
          >
            <Scale
              aria-hidden
              className="pointer-events-none absolute -bottom-5 right-3 size-32 text-line-soft"
            />
            <ul className="relative space-y-2.5">
              {guidelines.map((guideline) => (
                <li key={guideline.label}>
                  <Link
                    className="text-[13px] text-navy-500 hover:underline"
                    href={guideline.href}
                  >
                    {guideline.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Panel>

          <QuickActions />
        </div>
      </div>

      <div className="order-3 xl:order-none xl:col-start-2 xl:row-start-2">
        <InstrumentDigitalPassport />
      </div>
    </div>
  </>
);

export default BusinessDashboardPage;
