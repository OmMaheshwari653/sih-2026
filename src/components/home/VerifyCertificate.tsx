import { QrCode } from "lucide-react";

const VerifyCertificate = () => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4">
      <h2 className="text-sm font-semibold text-slate-900">
        Verify Certificate
      </h2>
      <p className="mt-1 text-[11px] text-slate-500">
        Enter Certificate ID or Scan QR Code
      </p>

      <input
        className="mt-3 w-full rounded border border-slate-300 px-3 py-2 text-xs outline-none placeholder:text-slate-400 focus:border-gov-accent"
        placeholder="Enter Certificate ID"
        type="text"
      />

      <button
        className="mt-3 w-full rounded bg-gov-navy py-2 text-xs font-semibold text-white hover:bg-gov-blue"
        type="button"
      >
        Verify
      </button>

      <div className="my-3 flex items-center gap-3">
        <span className="h-px flex-1 bg-slate-200" />
        <span className="text-[11px] text-slate-400">OR</span>
        <span className="h-px flex-1 bg-slate-200" />
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded border border-slate-300 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
        type="button"
      >
        <QrCode className="size-4" aria-hidden />
        Scan QR Code
      </button>
    </section>
  );
};

export default VerifyCertificate;
