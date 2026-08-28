import type { ComponentProps, ReactNode } from "react";

const control =
  "w-full rounded-gov border border-line bg-surface px-3 py-2.5 text-sm text-ink outline-none transition-colors placeholder:text-ink-muted/70 focus:border-navy-500 disabled:bg-surface-alt disabled:text-ink-muted";

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
    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
      active
        ? "border-navy bg-navy text-white"
        : "border-line bg-surface text-ink-muted hover:border-navy/40 hover:text-ink"
    }`}
    type="button"
    {...rest}
  >
    {children}
  </button>
);
