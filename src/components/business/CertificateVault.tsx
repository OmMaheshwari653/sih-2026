"use client";

import { Download, FileCheck2, Printer, Scale, Stamp } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Panel } from "@/components/ui/Panel";
import { certificates, instrumentById } from "@/lib/data";

const QrBlock = ({ size = "size-24" }: { size?: string }) => (
  <div className={`grid ${size} grid-cols-7 gap-px rounded-[2px] bg-white p-1`}>
    {Array.from({ length: 49 }, (_, index) => index).map((cell) => (
      <span
        className={
          [
            0, 1, 2, 4, 6, 7, 9, 11, 13, 14, 16, 18, 20, 21, 23, 25, 27, 28, 30,
            32, 34, 35, 37, 39, 41, 42, 44, 46, 48, 5, 12, 19, 26, 33,
          ].includes(cell)
            ? "bg-navy-900"
            : "bg-transparent"
        }
        key={cell}
      />
    ))}
  </div>
);

export const CertificateVault = () => {
  const [activeId, setActiveId] = useState(certificates[0].id);
  const active =
    certificates.find((item) => item.id === activeId) ?? certificates[0];
  const instrument = instrumentById(active.instrumentId);

  return (
    <div className="grid gap-4 xl:grid-cols-[19rem_minmax(0,1fr)]">
      <Panel
        bodyClassName="divide-y divide-line-soft"
        hint={`${certificates.length} certificates on record`}
        title="Issued certificates"
      >
        {certificates.map((certificate) => (
          <button
            className={`flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-surface-alt ${
              certificate.id === active.id ? "bg-navy/4" : ""
            }`}
            key={certificate.id}
            onClick={() => setActiveId(certificate.id)}
            type="button"
          >
            <FileCheck2
              className={`mt-0.5 size-4 shrink-0 ${
                certificate.id === active.id ? "text-navy" : "text-ink-muted"
              }`}
              aria-hidden
            />
            <span className="min-w-0 flex-1">
              <span className="num block text-[12px] font-semibold text-ink">
                {certificate.id}
              </span>
              <span className="block truncate text-[11px] text-ink-muted">
                {certificate.instrument}
              </span>
              <span className="num block text-[11px] text-ink-muted">
                Valid till {certificate.validTill}
              </span>
            </span>
          </button>
        ))}
      </Panel>

      <div className="space-y-4">
        {/* ------------------------------------------- Certificate preview */}
        <Panel
          action={
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary">
                <Printer className="size-3.5" aria-hidden />
                Print hologram sticker
              </Button>
              <Button size="sm">
                <Download className="size-3.5" aria-hidden />
                Download PDF
              </Button>
            </div>
          }
          bodyClassName="p-4 sm:p-6"
          title="Certificate preview"
        >
          <article className="gov-paper relative mx-auto max-w-3xl overflow-hidden rounded-[2px] border-2 border-navy/25 p-6 sm:p-8">
            {/* Watermark */}
            <Scale
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 size-72 -translate-x-1/2 -translate-y-1/2 text-navy/4"
            />

            <header className="relative border-b-2 border-navy/20 pb-4 text-center">
              <p className="font-deva text-[11px] text-ink-muted">
                भारत सरकार · उपभोक्ता मामले विभाग
              </p>
              <h3 className="mt-0.5 font-serif text-lg font-bold uppercase tracking-wide text-navy sm:text-xl">
                Certificate of Verification
              </h3>
              <p className="mt-0.5 text-[11px] text-ink-muted">
                Issued under Section 24 of the Legal Metrology Act, 2009 and
                Rule 15 of the Legal Metrology (General) Rules, 2011
              </p>
              <p className="num mt-2 inline-block rounded-[2px] border border-navy/25 px-3 py-0.5 text-[11px] font-bold text-navy">
                {active.id}
              </p>
            </header>

            <div className="relative mt-5 grid gap-6 sm:grid-cols-[minmax(0,1fr)_auto]">
              <dl className="space-y-2.5 text-[12.5px]">
                {[
                  ["Name of licensee", "ABC Traders"],
                  ["Address of premises", instrument.location],
                  ["Instrument verified", instrument.name],
                  ["Identification number", instrument.id],
                  ["Serial number", instrument.serial],
                  ["Make and model", `${instrument.make} ${instrument.model}`],
                  ["Accuracy class", instrument.accuracyClass],
                  ["Capacity / interval", instrument.capacity],
                  ["Date of verification", active.issuedOn],
                  ["Valid up to", active.validTill],
                ].map(([label, value]) => (
                  <div
                    className="flex flex-col gap-0.5 sm:flex-row sm:gap-3"
                    key={label}
                  >
                    <dt className="w-full text-ink-muted sm:w-48 sm:shrink-0">
                      {label}
                    </dt>
                    <dd className="font-semibold text-ink">
                      <span className="num">{value}</span>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="flex flex-row items-start gap-5 sm:flex-col sm:items-center">
                <div className="text-center">
                  <div className="rounded-[2px] border border-navy/20 p-1">
                    <QrBlock />
                  </div>
                  <p className="mt-1 text-[9px] uppercase tracking-wide text-ink-muted">
                    Scan to verify
                  </p>
                </div>

                <div className="flex size-24 flex-col items-center justify-center rounded-full border-2 border-dashed border-india-green/50 text-center">
                  <Stamp className="size-5 text-india-green" aria-hidden />
                  <p className="mt-0.5 px-2 text-[7.5px] font-bold uppercase leading-tight text-india-green">
                    Verified
                    <br />
                    Legal Metrology
                    <br />
                    Uttar Pradesh
                  </p>
                </div>
              </div>
            </div>

            <footer className="relative mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-navy/15 pt-4">
              <p className="num max-w-sm text-[10px] leading-4 text-ink-muted">
                Digitally signed record hash:
                <br />
                {active.hash}:81ab:5f60:2e14:cc07
                <br />
                Geo-fence confirmed within 50 m of the premises at the time of
                stamping.
              </p>
              <div className="text-right">
                <p className="font-serif text-sm italic text-navy">
                  {active.officer}
                </p>
                <p className="border-t border-ink/25 pt-1 text-[10px] uppercase tracking-wide text-ink-muted">
                  Legal Metrology Officer
                </p>
              </div>
            </footer>
          </article>
        </Panel>

        {/* --------------------------------------------- Sticker artwork */}
        <Panel
          hint="Paste this on the instrument where a customer can see it."
          title="Tamper-evident QR sticker"
        >
          <div className="flex flex-wrap items-center gap-5">
            <div className="w-56 overflow-hidden rounded-gov border-2 border-india-green">
              <div className="bg-india-green px-3 py-1.5 text-center">
                <p className="text-[9px] font-bold uppercase tracking-[0.1em] text-white">
                  Legal Metrology · Verified
                </p>
              </div>
              <div className="flex items-center gap-3 bg-white p-3">
                <div className="border border-line p-0.5">
                  <QrBlock size="size-16" />
                </div>
                <div className="min-w-0">
                  <p className="num text-[10px] font-bold text-ink">
                    {instrument.id}
                  </p>
                  <p className="num text-[10px] text-ink-muted">
                    Valid till {active.validTill}
                  </p>
                  <p className="mt-1 text-[8px] leading-3 text-ink-muted">
                    Scan before you pay. Report under-weighing at 1800-11-4000.
                  </p>
                </div>
              </div>
            </div>

            <div className="max-w-md text-[12.5px] leading-5 text-ink-muted">
              <p>
                Print on the departmental hologram stock supplied by the
                district office. The sticker destructs on removal, so a scale
                moved to another counter must be re-pinned through the
                relocation flow.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Button size="sm" variant="secondary">
                  <Download className="size-3.5" aria-hidden />
                  Download sticker artwork (PNG)
                </Button>
                <Button size="sm" variant="secondary">
                  <Printer className="size-3.5" aria-hidden />
                  Print on A4 sheet (12-up)
                </Button>
              </div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
};
