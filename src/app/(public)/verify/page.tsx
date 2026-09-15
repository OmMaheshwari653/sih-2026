import { QrScanner } from "@/components/public/QrScanner";

export const metadata = { title: "Scan & Verify a Scale" };

const VerifyScanPage = () => (
  <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
    <div className="mb-6 max-w-2xl px-1">
      <p className="text-xs font-medium uppercase tracking-[0.14em] text-navy-500">
        Public verification
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight text-ink sm:text-4xl">
        Scan the scale before you pay
      </h1>
      <p className="mt-2 text-[15px] leading-6 text-ink-muted">
        Point your camera at the QR sticker on any shop, mandi or fuel-pump
        instrument. No login needed.
      </p>
    </div>

    <QrScanner />
  </div>
);

export default VerifyScanPage;
