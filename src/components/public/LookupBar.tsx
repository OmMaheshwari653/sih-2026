"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const samples = ["LM-UP-PRY-000123", "LMC/UP/2025/0084219", "ESSAE-DS-45219"];

export const LookupBar = () => {
  const router = useRouter();
  const [query, setQuery] = useState("");

  const go = (value: string) => {
    const trimmed = value.trim();
    router.push(
      `/verify/${encodeURIComponent(trimmed.length ? trimmed : samples[0])}`,
    );
  };

  return (
    <div className="w-full">
      <form
        className="flex flex-col gap-2 rounded-gov border border-white/15 bg-white/8 p-2 backdrop-blur-sm sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          go(query);
        }}
      >
        <div className="flex flex-1 items-center gap-2 rounded-gov bg-white px-3">
          <Search className="size-4 shrink-0 text-ink-muted" aria-hidden />
          <input
            aria-label="Certificate ID, instrument ID or serial number"
            className="w-full bg-transparent py-3 text-sm text-ink outline-none placeholder:text-ink-muted/70"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Enter Certificate ID, Instrument ID or Scale Serial No."
            value={query}
          />
        </div>
        <button
          className="rounded-gov bg-saffron px-6 py-3 text-sm font-bold text-navy-900 transition-colors hover:bg-amber-400"
          type="submit"
        >
          Verify Now
        </button>
      </form>

      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] text-white/65">
        <span>Try:</span>
        {samples.map((sample) => (
          <button
            className="num rounded-full border border-white/20 px-2.5 py-1 text-white/85 transition-colors hover:border-saffron hover:text-saffron"
            key={sample}
            onClick={() => {
              setQuery(sample);
              go(sample);
            }}
            type="button"
          >
            {sample}
          </button>
        ))}
      </div>
    </div>
  );
};
