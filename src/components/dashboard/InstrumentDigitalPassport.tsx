import { BellRing, IdCard, QrCode, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { Panel } from "@/components/ui/Panel";
import { instrumentById } from "@/lib/data";

const InstrumentDigitalPassport = () => {
  const instrument = instrumentById("LM-UP-PRY-000123");

  return (
    <div className="space-y-4">
      <Panel
        action={<StatusBadge status={instrument.status} />}
        title="Instrument digital passport"
      >
        <div className="flex items-start gap-4">
          {/* Stand-in for the generated QR seal artwork */}
          <div className="grid size-20 shrink-0 grid-cols-5 gap-px rounded-gov border border-line bg-surface p-1.5">
            {Array.from({ length: 25 }, (_, index) => index).map((cell) => (
              <span
                className={
                  [
                    0, 1, 2, 5, 7, 10, 12, 14, 16, 18, 20, 22, 24, 3, 9, 11,
                  ].includes(cell)
                    ? "bg-navy"
                    : "bg-transparent"
                }
                key={cell}
              />
            ))}
          </div>

          <dl className="min-w-0 flex-1 space-y-2">
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-ink-muted">
                Instrument ID
              </dt>
              <dd className="num text-sm font-bold text-ink">
                {instrument.id}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-ink-muted">
                Instrument
              </dt>
              <dd className="text-sm font-semibold text-ink">
                {instrument.name}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] uppercase tracking-wide text-ink-muted">
                Valid till
              </dt>
              <dd className="num text-sm font-semibold text-emerald-700">
                {instrument.validTill}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-4 grid gap-2">
          <Link
            className="flex items-center justify-center gap-2 rounded-gov border border-line py-2.5 text-xs font-semibold text-ink hover:bg-surface-alt"
            href={`/verify/${instrument.id}`}
          >
            <IdCard className="size-4" aria-hidden />
            View public passport
          </Link>
          <Link
            className="flex items-center justify-center gap-2 rounded-gov border border-line py-2.5 text-xs font-semibold text-ink hover:bg-surface-alt"
            href="/business/certificates"
          >
            <QrCode className="size-4" aria-hidden />
            Download QR sticker
          </Link>
        </div>
      </Panel>

      <Panel title="Renewal reminder">
        <div className="flex items-start gap-3">
          <BellRing
            className="mt-0.5 size-5 shrink-0 text-amber-600"
            aria-hidden
          />
          <div>
            <p className="text-[13px] font-semibold text-ink">
              1 instrument expires within 30 days
            </p>
            <p className="mt-0.5 text-[12px] leading-4.5 text-ink-muted">
              Platform Scale (LM-UP-PRY-000124) at Mundera Mandi expires on 02
              Sep 2025. Apply now to avoid a late fee.
            </p>
          </div>
        </div>
        <Link
          className="mt-3.5 flex items-center justify-center gap-2 rounded-gov bg-navy py-2.5 text-xs font-semibold text-white hover:bg-navy-700"
          href="/business/instruments/LM-UP-PRY-000124/re-verify"
        >
          <ShieldCheck className="size-4" aria-hidden />
          Start re-verification
        </Link>
      </Panel>
    </div>
  );
};

export default InstrumentDigitalPassport;
