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
} from "lucide-react";
import Link from "next/link";
import { SealArt } from "@/components/illustrations/StepArt";
import { DataRow, Panel } from "@/components/ui/Panel";
import { resolveInstrument } from "@/lib/qr";

export const metadata = { title: "Instrument Verification" };

export default async function VerifyPage({
  params,
}: PageProps<"/verify/[qrId]">) {
  const { qrId } = await params;
  const instrument = resolveInstrument(qrId);
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
    ? "from-red-500 via-red-600 to-rose-800"
    : certified
      ? "from-emerald-400 via-emerald-600 to-teal-800"
      : expiring
        ? "from-amber-400 via-orange-500 to-orange-700"
        : "from-red-500 via-red-600 to-rose-800";

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-6 sm:px-6 sm:py-8">
      <div className="mb-3 flex items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-ink-muted">
          <ScanLine className="size-3.5" aria-hidden />
          Public verification result
        </p>
        <Link
          className="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-white"
          href="/verify"
        >
          <ScanLine className="size-3.5" aria-hidden />
          Scan another
        </Link>
      </div>

      {/* Status banner — the one thing a customer reads in two seconds. */}
      <div
        className={`relative overflow-hidden rounded-t-4xl bg-linear-to-br px-6 py-7 text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.35)] ${bannerClass} ${instrument ? "" : "rounded-b-4xl"}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-16 -top-24 size-72 rounded-full bg-white/20 blur-3xl"
        />
        <div className="relative flex items-start gap-4">
          <span className="glass-dark flex size-14 shrink-0 items-center justify-center rounded-2xl">
            {certified ? (
              <ShieldCheck className="size-7" aria-hidden />
            ) : (
              <ShieldAlert className="size-7" aria-hidden />
            )}
          </span>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/75">
              Status of this weighing instrument
            </p>
            <h1 className="mt-1 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
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
          <div className="glass rounded-b-4xl border-t-0 p-6">
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

              {/* Animated tamper-evident seal */}
              <SealArt className="size-24 shrink-0" />
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
        <div className="glass rounded-b-4xl border-t-0 p-6">
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
