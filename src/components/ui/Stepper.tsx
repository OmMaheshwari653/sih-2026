import { Check } from "lucide-react";

export const Stepper = ({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) => (
  <ol className="glass mb-5 flex gap-1 overflow-x-auto rounded-full p-1.5">
    {steps.map((label, index) => {
      const done = index < current;
      const active = index === current;
      return (
        <li
          className={`flex flex-1 items-center gap-2 rounded-full px-3 py-2 transition-colors ${
            active
              ? "bg-white shadow-[0_1px_2px_rgb(15_23_42/0.06),0_4px_12px_-4px_rgb(30_41_90/0.18)]"
              : ""
          }`}
          key={label}
        >
          <span
            className={`num flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
              done
                ? "bg-emerald-500 text-white"
                : active
                  ? "btn-ink"
                  : "bg-slate-500/10 text-ink-muted"
            }`}
          >
            {done ? <Check className="size-3.5" aria-hidden /> : index + 1}
          </span>
          <span
            className={`text-[11px] leading-4 sm:text-xs ${
              active ? "font-semibold text-ink" : "text-ink-muted"
            }`}
          >
            {label}
          </span>
        </li>
      );
    })}
  </ol>
);
