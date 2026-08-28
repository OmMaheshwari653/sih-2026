"use client";

import { Menu, ScanLine, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GovStrip, Masthead } from "@/components/shared/Masthead";

const links = [
  { label: "Home", href: "/" },
  { label: "Verify a Scale", href: "/verify/LM-UP-PRY-000123" },
  { label: "Report Fraud", href: "/report-fraud" },
  { label: "Verification Camps", href: "/camps" },
  { label: "Mandi Gatekeeper", href: "/gatekeeper/scan" },
  { label: "Know Your Rights", href: "/#rights" },
];

export const PublicHeader = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <>
      <GovStrip />
      <Masthead
        right={
          <div className="flex items-center gap-2">
            <Link
              className="hidden items-center gap-2 rounded-gov border border-line px-3 py-2 text-xs font-semibold text-navy hover:bg-surface-alt sm:inline-flex"
              href="/verify/LM-UP-PRY-000123"
            >
              <ScanLine className="size-4" aria-hidden />
              Scan QR
            </Link>
            <Link
              className="rounded-gov bg-navy px-3.5 py-2 text-xs font-semibold text-white hover:bg-navy-700"
              href="/auth"
            >
              Login / Register
            </Link>
            <button
              aria-label="Open menu"
              className="rounded-gov border border-line p-2 text-navy lg:hidden"
              onClick={() => setOpen((value) => !value)}
              type="button"
            >
              {open ? (
                <X className="size-4" aria-hidden />
              ) : (
                <Menu className="size-4" aria-hidden />
              )}
            </button>
          </div>
        }
      />

      <div className="sticky top-0 z-30 border-b border-navy-900/40 bg-navy text-white">
        <nav className="mx-auto hidden w-full max-w-360 items-center gap-0.5 px-4 sm:px-6 lg:flex">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                className={`border-b-2 px-3.5 py-3 text-[13px] transition-colors ${
                  active
                    ? "border-saffron font-semibold text-white"
                    : "border-transparent text-white/80 hover:bg-white/8 hover:text-white"
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
          <nav className="flex flex-col lg:hidden">
            {links.map((link) => (
              <Link
                className="border-b border-white/10 px-4 py-3 text-sm text-white/85"
                href={link.href}
                key={link.label}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        ) : (
          <p className="px-4 py-2.5 text-[11px] text-white/70 lg:hidden">
            Scan any scale&apos;s QR sticker to check if it is legally stamped.
          </p>
        )}
      </div>
    </>
  );
};
