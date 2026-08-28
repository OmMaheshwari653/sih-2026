"use client";

import { QrCode, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Kept at the very top on phones — a trader most often opens the portal at the
 * counter to prove that a specific certificate is genuine.
 */
const VerifyCertificate = () => {
  const router = useRouter();
  const [value, setValue] = useState("");

  return (
    <section className="rounded-gov border border-line border-t-3 border-t-navy bg-surface p-4 shadow-sm xl:border-t xl:border-t-line xl:shadow-none">
      <h2 className="text-sm font-semibold text-ink">Verify a certificate</h2>
      <p className="mt-0.5 text-[11px] text-ink-muted">
        Check any instrument ID, certificate number or serial against the
        national register.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          router.push(
            `/verify/${encodeURIComponent(value.trim() || "LM-UP-PRY-000123")}`,
          );
        }}
      >
        <div className="mt-3 flex items-center gap-2 rounded-gov border border-line px-3 focus-within:border-navy-500">
          <Search className="size-4 shrink-0 text-ink-muted" aria-hidden />
          <input
            aria-label="Certificate or instrument ID"
            className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-ink-muted/70 sm:py-2.5 sm:text-xs"
            onChange={(event) => setValue(event.target.value)}
            placeholder="LMC/UP/2025/0084219"
            value={value}
          />
        </div>

        <button
          className="mt-3 w-full rounded-gov bg-navy py-3 text-sm font-semibold text-white hover:bg-navy-700 sm:py-2.5 sm:text-xs"
          type="submit"
        >
          Verify
        </button>
      </form>

      <div className="my-3 flex items-center gap-3">
        <span className="h-px flex-1 bg-line-soft" />
        <span className="text-[11px] text-ink-muted">OR</span>
        <span className="h-px flex-1 bg-line-soft" />
      </div>

      <button
        className="flex w-full items-center justify-center gap-2 rounded-gov border border-line py-3 text-sm font-semibold text-ink hover:bg-surface-alt sm:py-2.5 sm:text-xs"
        onClick={() => router.push("/verify/LM-UP-PRY-000123")}
        type="button"
      >
        <QrCode className="size-4" aria-hidden />
        Scan QR code
      </button>
    </section>
  );
};

export default VerifyCertificate;
