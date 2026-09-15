import { QrScanner } from "@/components/public/QrScanner";

export const metadata = { title: "Scan & Verify a Scale" };

/*
 * The scanner fills exactly one screen below the header, so the camera,
 * result and typed lookup are all in view without scrolling.
 */
const VerifyScanPage = () => (
  <div className="mx-auto flex h-[calc(100svh-8.5rem)] min-h-136 w-full max-w-6xl flex-col gap-3 px-3 pb-3 pt-2 sm:px-6">
    <div className="flex flex-wrap items-baseline justify-between gap-x-4 px-1">
      <h1 className="text-xl font-semibold tracking-tight text-ink sm:text-2xl">
        Scan the scale before you pay
      </h1>
      <p className="hidden text-sm text-ink-muted sm:block">
        Shops, mandis, fuel pumps · no login needed
      </p>
    </div>

    <div className="min-h-0 flex-1">
      <QrScanner />
    </div>
  </div>
);

export default VerifyScanPage;
