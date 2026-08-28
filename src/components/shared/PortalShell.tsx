"use client";

import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ChevronDown,
  Headphones,
  LogOut,
  Menu,
  UserRound,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type ReactNode, useState } from "react";
import { GovStrip, Masthead } from "@/components/shared/Masthead";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export type PortalUser = {
  name: string;
  role: string;
  meta: string;
};

const NavList = ({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) => (
  <nav className="flex flex-col gap-0.5 p-3">
    {items.map((item) => {
      const Icon = item.icon;
      const active =
        pathname === item.href || pathname.startsWith(`${item.href}/`);
      return (
        <Link
          className={`flex items-center gap-3 rounded-gov px-3 py-2.5 text-[13px] transition-colors ${
            active
              ? "bg-white/12 font-semibold text-white shadow-[inset_3px_0_0_0_var(--color-saffron)]"
              : "text-white/75 hover:bg-white/8 hover:text-white"
          }`}
          href={item.href}
          key={item.href}
          onClick={onNavigate}
        >
          <Icon className="size-4.5 shrink-0" aria-hidden />
          <span className="flex-1">{item.label}</span>
          {item.badge ? (
            <span className="num flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              {item.badge}
            </span>
          ) : null}
        </Link>
      );
    })}
  </nav>
);

const HelpCard = () => (
  <div className="m-3 rounded-gov border border-white/12 bg-white/8 p-4 text-center">
    <Headphones className="mx-auto size-5 text-saffron" aria-hidden />
    <p className="mt-2 text-xs font-semibold text-white">
      Departmental Helpdesk
    </p>
    <p className="num mt-1 text-lg font-bold tracking-wide text-white">
      1800-11-4000
    </p>
    <p className="mt-0.5 text-[10px] text-white/60">
      Mon–Sat · 9:00 AM – 6:00 PM
    </p>
  </div>
);

export const PortalShell = ({
  items,
  user,
  portalName,
  children,
}: {
  items: NavItem[];
  user: PortalUser;
  portalName: string;
  children: ReactNode;
}) => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <GovStrip />
      <Masthead
        right={
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden rounded-gov border border-line bg-surface-alt px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy md:inline">
              {portalName}
            </span>
            <button
              aria-label="Notifications"
              className="relative text-navy"
              type="button"
            >
              <Bell className="size-5" aria-hidden />
              <span className="num absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                5
              </span>
            </button>
            <button className="flex items-center gap-2" type="button">
              <span className="flex size-9 items-center justify-center rounded-full bg-navy text-white">
                <UserRound className="size-4.5" aria-hidden />
              </span>
              <span className="hidden text-left leading-4 sm:block">
                <span className="block text-[10px] uppercase tracking-wide text-ink-muted">
                  {user.role}
                </span>
                <span className="block text-xs font-semibold text-ink">
                  {user.name}
                </span>
              </span>
              <ChevronDown
                className="hidden size-4 text-ink-muted sm:block"
                aria-hidden
              />
            </button>
          </div>
        }
      />

      <div className="mx-auto flex w-full max-w-360 flex-1">
        <aside className="hidden w-60 shrink-0 flex-col justify-between bg-navy text-white lg:flex">
          <div>
            <div className="border-b border-white/10 px-4 py-3.5">
              <p className="text-[10px] uppercase tracking-[0.14em] text-saffron">
                {user.role}
              </p>
              <p className="mt-0.5 text-sm font-semibold">{user.name}</p>
              <p className="text-[11px] text-white/60">{user.meta}</p>
            </div>
            <NavList items={items} pathname={pathname} />
          </div>
          <div>
            <HelpCard />
            <Link
              className="flex items-center gap-2 border-t border-white/10 px-4 py-3 text-xs text-white/70 hover:text-white"
              href="/"
            >
              <LogOut className="size-4" aria-hidden />
              Sign out of portal
            </Link>
          </div>
        </aside>

        <main
          className="w-full min-w-0 flex-1 px-4 py-5 pb-24 sm:px-6 lg:pb-8"
          id="main"
        >
          {children}
        </main>
      </div>

      <button
        aria-label="Open portal menu"
        className="fixed bottom-5 left-5 z-40 flex size-13 items-center justify-center rounded-full bg-navy text-white shadow-lg ring-4 ring-navy/15 lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {open ? (
        <>
          <button
            aria-label="Close portal menu"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
            type="button"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col overflow-y-auto bg-navy text-white lg:hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
              <div>
                <p className="text-[10px] uppercase tracking-[0.14em] text-saffron">
                  {user.role}
                </p>
                <p className="text-sm font-semibold">{user.name}</p>
              </div>
              <button
                aria-label="Close"
                className="rounded p-1 hover:bg-white/10"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="size-5" aria-hidden />
              </button>
            </div>
            <NavList
              items={items}
              onNavigate={() => setOpen(false)}
              pathname={pathname}
            />
            <HelpCard />
          </aside>
        </>
      ) : null}
    </div>
  );
};
