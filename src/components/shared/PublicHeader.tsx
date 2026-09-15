"use client";

import { Menu, ScanLine, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GovStrip, Masthead } from "@/components/shared/Masthead";

const links = [
  { label: "Home", href: "/" },
  { label: "Scan & Verify", href: "/verify" },
  { label: "Report Fraud", href: "/report-fraud" },
  { label: "Camps", href: "/camps" },
  { label: "Your Rights", href: "/#rights" },
];

export const PublicHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <GovStrip />
      <Masthead
        right={
          <div className="flex items-center gap-1.5">
            <Link
              className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-xs font-semibold text-ink transition-colors hover:bg-white/70 sm:inline-flex"
              href="/verify"
            >
              <ScanLine className="size-4" aria-hidden />
              Scan QR
            </Link>
            <Link
              className="btn-ink rounded-full px-4 py-2 text-xs font-semibold transition-all hover:brightness-125"
              href="/auth"
            >
              Sign in
            </Link>
            <button
              aria-expanded={open}
              aria-label="Open menu"
              className="rounded-full p-2 text-ink hover:bg-white/70 lg:hidden"
              onClick={() => setOpen((value) => !value)}
              type="button"
            >
              {open ? (
                <X className="size-4.5" aria-hidden />
              ) : (
                <Menu className="size-4.5" aria-hidden />
              )}
            </button>
          </div>
        }
      >
        <nav className="hidden items-center gap-0.5 rounded-full border border-white/70 bg-white/45 p-1 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                className={`rounded-full px-3.5 py-1.5 text-[13px] transition-all duration-200 ${
                  active
                    ? "bg-white font-semibold text-ink shadow-[0_1px_2px_rgb(15_23_42/0.06),0_4px_12px_-4px_rgb(30_41_90/0.2)]"
                    : "text-ink-muted hover:text-ink"
                }`}
                href={link.href}
                key={link.label}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {open ? (
          <nav className="order-last flex w-full flex-col gap-0.5 border-t border-line-soft pt-2 lg:hidden">
            {links.map((link) => (
              <Link
                className={`rounded-xl px-3 py-2.5 text-sm ${
                  pathname === link.href
                    ? "bg-white font-semibold text-ink"
                    : "text-ink-muted"
                }`}
                href={link.href}
                key={link.label}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : null}
      </Masthead>
    </>
  );
};
