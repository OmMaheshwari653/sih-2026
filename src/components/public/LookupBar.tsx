"use client";

import { ArrowRight, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const samples = ["LM-UP-PRY-000123", "LMC/UP/2025/0084219", "ESSAE-DS-45219"];

/** Typed lookup for when the sticker is printed but there's no camera handy. */
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
        className="glass group flex items-center gap-2 rounded-full p-1.5 pl-5 transition-shadow focus-within:shadow-[0_0_0_4px_rgb(61_90_254/0.12),0_12px_32px_-12px_rgb(30_41_90/0.25)]"
        onSubmit={(event) => {
          event.preventDefault();
          go(query);
        }}
      >
        <Search className="size-4 shrink-0 text-ink-muted" aria-hidden />
        <input
          aria-label="Certificate ID, instrument ID or serial number"
          className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-ink outline-none placeholder:text-ink-muted/70"
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Or type a certificate / instrument ID"
          value={query}
        />
        <button
          aria-label="Verify"
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-ink text-white transition-transform duration-300 hover:scale-105 group-focus-within:bg-navy-500"
          type="submit"
        >
          <ArrowRight className="size-4" aria-hidden />
        </button>
      </form>

      <div className="mt-3 flex flex-wrap items-center gap-2 px-1 text-[11px] text-ink-muted">
        <span>Try</span>
        {samples.map((sample) => (
          <button
            className="num rounded-full border border-line bg-white/50 px-2.5 py-1 font-mono text-ink/70 transition-colors hover:border-ink/30 hover:bg-white hover:text-ink"
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
