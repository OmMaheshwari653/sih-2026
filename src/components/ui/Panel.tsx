import type { ReactNode } from "react";

type PanelProps = {
  title?: string;
  hint?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
};

/**
 * The single content container used across the portal. A flat 1px rule and a
 * navy accent on the heading keeps the surface closer to a printed government
 * form than to a floating web card.
 */
export const Panel = ({
  title,
  hint,
  action,
  children,
  className = "",
  bodyClassName = "",
}: PanelProps) => (
  <section className={`rounded-gov border border-line bg-surface ${className}`}>
    {title ? (
      <header className="flex flex-wrap items-center justify-between gap-2 border-b border-line-soft px-4 py-3">
        <div className="border-l-[3px] border-navy pl-2.5">
          <h2 className="text-sm font-semibold tracking-tight text-ink">
            {title}
          </h2>
          {hint ? <p className="text-[11px] text-ink-muted">{hint}</p> : null}
        </div>
        {action}
      </header>
    ) : null}
    <div className={bodyClassName || "p-4"}>{children}</div>
  </section>
);

export const SectionLabel = ({ children }: { children: ReactNode }) => (
  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-muted">
    {children}
  </p>
);

/** Key/value row used on certificates, passports and read-only summaries. */
export const DataRow = ({
  label,
  value,
  mono,
}: {
  label: string;
  value: ReactNode;
  mono?: boolean;
}) => (
  <div className="flex flex-col gap-0.5 border-b border-line-soft py-2 last:border-0 sm:flex-row sm:items-baseline sm:gap-4">
    <dt className="w-full text-[11px] uppercase tracking-wide text-ink-muted sm:w-44 sm:shrink-0">
      {label}
    </dt>
    <dd
      className={`text-sm text-ink ${mono ? "num font-semibold" : "font-medium"}`}
    >
      {value}
    </dd>
  </div>
);
