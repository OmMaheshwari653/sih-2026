import { ChevronRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

export const PageHeader = ({
  title,
  subtitle,
  crumbs = [],
  action,
}: {
  title: string;
  subtitle?: string;
  crumbs?: { label: string; href?: string }[];
  action?: ReactNode;
}) => (
  <header className="mb-5 px-1">
    {crumbs.length ? (
      <nav
        aria-label="Breadcrumb"
        className="mb-2.5 flex flex-wrap items-center gap-1 text-[11px] text-ink-muted"
      >
        {crumbs.map((crumb, index) => (
          <span className="flex items-center gap-1" key={crumb.label}>
            {crumb.href ? (
              <Link
                className="rounded-full px-1.5 py-0.5 transition-colors hover:bg-white/60 hover:text-ink"
                href={crumb.href}
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="px-1.5 py-0.5 font-medium text-ink">
                {crumb.label}
              </span>
            )}
            {index < crumbs.length - 1 ? (
              <ChevronRight className="size-3 text-ink/30" aria-hidden />
            ) : null}
          </span>
        ))}
      </nav>
    ) : null}

    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1
          className="text-2xl font-semibold tracking-tight text-ink sm:text-[28px]"
          data-split="lines"
        >
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-1 text-sm text-ink-muted">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  </header>
);
