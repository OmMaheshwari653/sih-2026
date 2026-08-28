import { Check } from "lucide-react";

export const Stepper = ({
  steps,
  current,
}: {
  steps: string[];
  current: number;
}) => (
  <ol className="mb-4 flex overflow-hidden rounded-gov border border-line bg-surface">
    {steps.map((label, index) => {
      const done = index < current;
      const active = index === current;
      return (
        <li
          className={`flex flex-1 items-center gap-2 border-r border-line px-3 py-2.5 last:border-r-0 ${
            active ? "bg-navy/5" : ""
          }`}
          key={label}
        >
          <span
            className={`num flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
              done
                ? "bg-india-green text-white"
                : active
                  ? "bg-navy text-white"
                  : "bg-surface-alt text-ink-muted"
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
