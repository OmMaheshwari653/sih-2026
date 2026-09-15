import type { ComponentProps, ReactNode } from "react";

const control =
  "w-full rounded-xl border border-white/80 bg-white/65 px-3.5 py-2.5 text-sm text-ink shadow-[inset_0_1px_2px_rgb(15_23_42/0.06)] outline-none backdrop-blur-md transition-all duration-200 placeholder:text-ink-muted/60 hover:bg-white/80 focus:border-navy-500/50 focus:bg-white focus:ring-4 focus:ring-navy-500/12 disabled:bg-white/30 disabled:text-ink-muted";

export const Field = ({
  label,
  hint,
  required,
  children,
  className = "",
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: the control is passed in as children
  <label className={`block ${className}`}>
    <span className="mb-1.5 block text-xs font-semibold text-ink">
      {label}
      {required ? <span className="ml-0.5 text-red-600">*</span> : null}
    </span>
    {children}
    {hint ? (
      <span className="mt-1 block text-[11px] text-ink-muted">{hint}</span>
    ) : null}
  </label>
);

export const Input = ({ className = "", ...rest }: ComponentProps<"input">) => (
  <input className={`${control} ${className}`} {...rest} />
);

export const Select = ({
  className = "",
  children,
  ...rest
}: ComponentProps<"select">) => (
  <select className={`${control} ${className}`} {...rest}>
    {children}
  </select>
);

export const Textarea = ({
  className = "",
  ...rest
}: ComponentProps<"textarea">) => (
  <textarea className={`${control} ${className}`} rows={4} {...rest} />
);

/** Selectable chip group — used for issue types, reasons, filters. */
export const Chip = ({
  active,
  children,
  ...rest
}: { active?: boolean } & ComponentProps<"button">) => (
  <button
    className={`rounded-full border px-3.5 py-1.5 text-xs font-medium transition-all duration-200 ${
      active
        ? "btn-ink border-transparent"
        : "border-white/80 bg-white/55 text-ink-muted backdrop-blur-md hover:bg-white/85 hover:text-ink"
    }`}
    type="button"
    {...rest}
  >
    {children}
  </button>
);
