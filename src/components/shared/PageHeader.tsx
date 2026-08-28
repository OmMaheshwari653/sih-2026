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
  <header className="mb-4">
    {crumbs.length ? (
      <nav
        aria-label="Breadcrumb"
        className="mb-2 flex flex-wrap items-center gap-1 text-[11px] text-ink-muted"
      >
        {crumbs.map((crumb, index) => (
          <span className="flex items-center gap-1" key={crumb.label}>
            {crumb.href ? (
              <Link
                className="hover:text-navy hover:underline"
                href={crumb.href}
              >
                {crumb.label}
              </Link>
            ) : (
              <span className="text-ink">{crumb.label}</span>
            )}
            {index < crumbs.length - 1 ? (
              <ChevronRight className="size-3" aria-hidden />
            ) : null}
          </span>
        ))}
      </nav>
    ) : null}

    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-serif text-xl font-bold tracking-tight text-ink sm:text-2xl">
          {title}
        </h1>
        {subtitle ? (
          <p className="mt-0.5 text-xs text-ink-muted">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  </header>
);
