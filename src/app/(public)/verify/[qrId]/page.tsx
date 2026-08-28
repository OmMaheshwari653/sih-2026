import {
  BadgeCheck,
  Building2,
  CalendarClock,
  Fingerprint,
  FlagTriangleRight,
  MapPin,
  ScanLine,
  ShieldAlert,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import Link from "next/link";
import { DataRow, Panel } from "@/components/ui/Panel";
import { instruments } from "@/lib/data";

export const metadata = { title: "Instrument Verification" };

const resolve = (raw: string) => {
  const key = decodeURIComponent(raw).toUpperCase();
  return (
    instruments.find(
      (item) =>
        item.id.toUpperCase() === key ||
        item.serial.toUpperCase() === key ||
        item.certificateId?.toUpperCase() === key,
    ) ?? null
  );
};

export default async function VerifyPage({
  params,
}: PageProps<"/verify/[qrId]">) {
  const { qrId } = await params;
  const instrument = resolve(qrId);
  const certified = instrument?.status === "valid";
  const expiring = instrument?.status === "expiring";

  const headline = !instrument
    ? "Unverified — no record found"
    : certified
      ? "Certified & Active"
      : expiring
        ? "Valid — expiring shortly"
        : instrument.status === "expired"
          ? "Expired — do not transact"
          : "Rejected on last inspection";

  const bannerClass = !instrument
    ? "bg-red-700"
    : certified
      ? "bg-india-green"
      : expiring
        ? "bg-amber-600"
        : "bg-red-700";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <p className="mb-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
        <ScanLine className="size-3.5" aria-hidden />
        Public verification result
      </p>

      {/* Status banner — the one thing a customer reads in two seconds. */}
      <div className={`rounded-t-gov px-5 py-6 text-white ${bannerClass}`}>
        <div className="flex items-start gap-3.5">
          {certified ? (
            <ShieldCheck className="size-9 shrink-0" aria-hidden />
          ) : (
            <ShieldAlert className="size-9 shrink-0" aria-hidden />
          )}
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
              Status of this weighing instrument
            </p>
            <h1 className="font-serif text-2xl font-bold leading-tight sm:text-3xl">
              {headline}
            </h1>
            <p className="num mt-1 text-xs text-white/80">
              QR / ID scanned: {decodeURIComponent(qrId)}
            </p>
          </div>
        </div>
      </div>

      {instrument ? (
        <>
          <div className="rounded-b-gov border border-t-0 border-line bg-surface p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-ink">
                  {instrument.name}
                </h2>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-muted">
                  <Building2 className="size-3.5" aria-hidden />
                  ABC Traders · GSTIN 09AABCA1234F1Z5
                </p>
                <p className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted">
                  <MapPin className="size-3.5" aria-hidden />
                  {instrument.location}
                </p>
              </div>

              {/* Stylised tamper-evident seal */}
              <div className="flex size-24 shrink-0 flex-col items-center justify-center rounded-full border-2 border-dashed border-navy/35 text-center">
                <Stamp className="size-6 text-navy" aria-hidden />
                <p className="mt-1 px-2 text-[8px] font-bold uppercase leading-tight tracking-wide text-navy">
                  Legal Metrology
                  <br />
                  Digital Seal
                </p>
              </div>
            </div>

            <dl className="mt-5">
              <DataRow label="Instrument ID" mono value={instrument.id} />
              <DataRow label="Serial Number" mono value={instrument.serial} />
              <DataRow
                label="Category / Class"
                value={`${instrument.category} · ${instrument.accuracyClass}`}
              />
              <DataRow
                label="Make & Model"
                value={`${instrument.make} ${instrument.model}`}
              />
              <DataRow label="Capacity" value={instrument.capacity} />
              <DataRow
                label="Last Stamped On"
                mono
                value={instrument.stampedOn}
              />
              <DataRow
                label="Valid Till"
                value={
                  <span
                    className={
                      certified
                        ? "num font-semibold text-emerald-700"
                        : "num font-semibold text-red-700"
                    }
                  >
                    {instrument.validTill}
                  </span>
                }
              />
            </dl>
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Panel title="Verifying officer">
              <dl className="space-y-2.5 text-sm">
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-ink-muted">
                    Legal Metrology Officer
                  </dt>
                  <dd className="font-semibold text-ink">
                    {instrument.officer}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-ink-muted">
                    Certificate Number
                  </dt>
                  <dd className="num font-semibold text-ink">
                    {instrument.certificateId ?? "Not issued"}
                  </dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-wide text-ink-muted">
                    Record hash
                  </dt>
                  <dd className="num flex items-center gap-1.5 break-all text-xs text-ink">
                    <Fingerprint
                      className="size-3.5 shrink-0 text-navy"
                      aria-hidden
                    />
                    9f2c:4ae1:77b0:c3d9:81ab:5f60:2e14:cc07
                  </dd>
                </div>
              </dl>
              <p className="mt-3 flex items-start gap-1.5 rounded-gov bg-surface-alt p-2.5 text-[11px] leading-4 text-ink-muted">
                <BadgeCheck
                  className="mt-px size-3.5 shrink-0 text-india-green"
                  aria-hidden
                />
                Geo-fence confirmed at the time of stamping — the officer&apos;s
                device was within 50 m of these premises.
              </p>
            </Panel>

            <Panel title="Something wrong with this scale?">
              <p className="text-[13px] leading-5 text-ink-muted">
                If the weight looks manipulated, the seal is broken, or the
                trader refuses to show the certificate, you can lodge a
                complaint with photo evidence and a live location tag. Reports
                can be filed anonymously.
              </p>
              <Link
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-gov bg-red-700 px-4 py-3 text-sm font-semibold text-white hover:bg-red-800"
                href={`/report-fraud?scale=${instrument.id}`}
              >
                <FlagTriangleRight className="size-4" aria-hidden />
                Report this scale
              </Link>
              <p className="mt-2.5 flex items-center gap-1.5 text-[11px] text-ink-muted">
                <CalendarClock className="size-3.5" aria-hidden />
                Complaints are triaged by the district LMO within 48 hours.
              </p>
            </Panel>
          </div>
        </>
      ) : (
        <div className="rounded-b-gov border border-t-0 border-line bg-surface p-5">
          <p className="text-sm leading-6 text-ink">
            No stamping record exists against{" "}
            <span className="num font-semibold">
              {decodeURIComponent(qrId)}
            </span>
            . Either the sticker is counterfeit or the instrument was never
            presented for verification. Do not rely on readings from this
            instrument.
          </p>
          <Link
            className="mt-4 inline-flex items-center justify-center gap-2 rounded-gov bg-red-700 px-4 py-3 text-sm font-semibold text-white hover:bg-red-800"
            href="/report-fraud"
          >
            <FlagTriangleRight className="size-4" aria-hidden />
            Report this shop
          </Link>
        </div>
      )}

      <div className="mt-5 rounded-gov border border-dashed border-line bg-surface-alt p-3.5">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-ink-muted">
          Demo — open other outcomes
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {[
            { id: "LM-UP-PRY-000123", label: "Certified" },
            { id: "LM-UP-PRY-000124", label: "Expiring soon" },
            { id: "LM-UP-PRY-000126", label: "Expired" },
            { id: "LM-UP-PRY-000127", label: "Rejected" },
            { id: "LM-XX-FAKE-999999", label: "Counterfeit sticker" },
          ].map((sample) => (
            <Link
              className="rounded-full border border-line bg-surface px-2.5 py-1 text-[11px] font-medium text-ink-muted hover:border-navy hover:text-navy"
              href={`/verify/${sample.id}`}
              key={sample.id}
            >
              {sample.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
