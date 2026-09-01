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
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { GovStrip, Masthead } from "@/components/shared/Masthead";
import {
  clearSessionUser,
  loginHrefForRole,
  readSessionUser,
  type StoredUser,
} from "@/lib/auth";

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
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // --- session user / logout menu ---
  const [menuOpen, setMenuOpen] = useState(false);
  const [sessionUser, setSessionUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    setSessionUser(readSessionUser());
  }, []);

  const displayName = sessionUser?.name ?? user.name;

  const logout = () => {
    clearSessionUser();
    setMenuOpen(false);
    router.push(sessionUser ? loginHrefForRole(sessionUser.role) : "/auth");
  };

  // --- notifications dropdown ---
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Verification rejected",
      message: "Scale SC-1024 requires action.",
      time: "2 hours ago",
      unread: true,
      type: "critical",
      href: "/business/instruments",
    },
    {
      id: 2,
      title: "Scales expiring soon",
      message: "3 instruments need renewal within 30 days.",
      time: "5 hours ago",
      unread: true,
      type: "warning",
      href: "/business/instruments",
    },
    {
      id: 3,
      title: "Verification completed",
      message: "Scale SC-1008 was successfully verified.",
      time: "Yesterday",
      unread: true,
      type: "success",
      href: "/business/instruments",
    },
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <GovStrip />
      <Masthead
        right={
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="hidden rounded-gov border border-line bg-surface-alt px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-navy md:inline">
              {portalName}
            </span>

            {/* Notifications */}
            <div className="relative">
              <button
                aria-label="Notifications"
                aria-expanded={notificationsOpen}
                className="relative rounded-gov p-1 text-navy hover:bg-surface-alt"
                onClick={() => setNotificationsOpen((prev) => !prev)}
                type="button"
              >
                <Bell className="size-5" aria-hidden />

                {notifications.filter((notification) => notification.unread)
                  .length > 0 && (
                  <span className="num absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {
                      notifications.filter(
                        (notification) => notification.unread,
                      ).length
                    }
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 top-10 z-50 w-80 overflow-hidden rounded-gov border border-line bg-white shadow-xl">
                  {/* Header */}
                  <div className="flex items-center justify-between border-b border-line px-4 py-3">
                    <div>
                      <p className="text-sm font-semibold text-ink">
                        Notifications
                      </p>

                      <p className="text-[11px] text-ink-muted">
                        Recent alerts and updates
                      </p>
                    </div>

                    {notifications.some(
                      (notification) => notification.unread,
                    ) && (
                      <button
                        className="text-[11px] font-semibold text-navy hover:underline"
                        onClick={() =>
                          setNotifications((current) =>
                            current.map((notification) => ({
                              ...notification,
                              unread: false,
                            })),
                          )
                        }
                        type="button"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  {/* Notifications */}
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center text-sm text-ink-muted">
                        No notifications
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <Link
                          key={notification.id}
                          href={notification.href}
                          onClick={() => {
                            setNotifications((current) =>
                              current.map((item) =>
                                item.id === notification.id
                                  ? { ...item, unread: false }
                                  : item,
                              ),
                            );

                            setNotificationsOpen(false);
                          }}
                          className={`block border-b border-line px-4 py-3 transition-colors hover:bg-surface-alt ${
                            notification.unread ? "bg-surface-alt/60" : "bg-white"
                          }`}
                        >
                          <div className="flex gap-3">
                            {/* Severity indicator */}
                            <span
                              className={`mt-1.5 size-2 shrink-0 rounded-full ${
                                notification.type === "critical"
                                  ? "bg-red-500"
                                  : notification.type === "warning"
                                    ? "bg-amber-500"
                                    : "bg-green-500"
                              }`}
                            />

                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-2">
                                <p
                                  className={`text-xs ${
                                    notification.unread
                                      ? "font-semibold text-ink"
                                      : "font-medium text-ink-muted"
                                  }`}
                                >
                                  {notification.title}
                                </p>

                                {/* Unread indicator */}
                                {notification.unread && (
                                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-navy" />
                                )}
                              </div>

                              <p className="mt-0.5 text-[11px] leading-4 text-ink-muted">
                                {notification.message}
                              </p>

                              <p className="mt-1 text-[10px] text-ink-muted">
                                {notification.time}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Session user / logout menu */}
            <div className="relative">
              <button
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2"
                onClick={() => setMenuOpen((value) => !value)}
                type="button"
              >
                <span className="flex size-9 items-center justify-center rounded-full bg-navy text-white">
                  <UserRound className="size-4.5" aria-hidden />
                </span>
                <span className="hidden text-left leading-4 sm:block">
                  <span className="block text-[10px] uppercase tracking-wide text-ink-muted">
                    {user.role}
                  </span>
                  <span className="block text-xs font-semibold text-ink">
                    {displayName}
                  </span>
                </span>
                <ChevronDown
                  className="hidden size-4 text-ink-muted sm:block"
                  aria-hidden
                />
              </button>

              {menuOpen ? (
                <>
                  <button
                    aria-label="Close user menu"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setMenuOpen(false)}
                    type="button"
                  />
                  <div
                    className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-gov border border-line bg-surface shadow-lg"
                    role="menu"
                  >
                    <button
                      className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      onClick={logout}
                      role="menuitem"
                      type="button"
                    >
                      <LogOut className="size-3.5" aria-hidden />
                      Logout
                    </button>
                  </div>
                </>
              ) : null}
            </div>
          </div>
        }
      />

      <div className="flex w-full flex-1">
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