import { BellRing, IdCard, ShieldCheck } from "lucide-react";

const fields = [
  { label: "Instrument ID", value: "LM-UP-PRY-000123" },
  { label: "Instrument Name", value: "Digital Weighing Scale" },
  { label: "Owner", value: "ABC Traders" },
];

const InstrumentDigitalPassport = () => {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="size-5 text-gov-green" aria-hidden />
          <h2 className="text-sm font-semibold text-slate-900">
            Instrument Digital Passport
          </h2>
        </div>

        <dl className="mt-3 space-y-2">
          {fields.map((field) => (
            <div key={field.label}>
              <dt className="text-[11px] text-slate-500">{field.label}</dt>
              <dd className="text-sm font-semibold text-slate-900">
                {field.value}
              </dd>
            </div>
          ))}
        </dl>

        <button
          className="mt-4 flex w-full items-center justify-center gap-2 rounded border border-slate-300 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          type="button"
        >
          <IdCard className="size-4" aria-hidden />
          View Full Passport
        </button>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <BellRing className="size-5 text-gov-green" aria-hidden />
          <h2 className="text-sm font-semibold text-slate-900">
            Renewal Reminder
          </h2>
        </div>

        <p className="mt-2 text-[11px] text-slate-600">
          1 instrument is expiring in next 30 days
        </p>

        <button
          className="mt-3 w-full rounded border border-slate-300 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
          type="button"
        >
          View Expiring Instruments
        </button>
      </section>
    </div>
  );
};

export default InstrumentDigitalPassport;
