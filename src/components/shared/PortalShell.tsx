"use client";

import { animate, stagger } from "animejs";
import type { LucideIcon } from "lucide-react";
import {
  Bell,
  ChevronDown,
  Headphones,
  LogOut,
  Menu,
  Search,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";
import { GovStrip, Masthead } from "@/components/shared/Masthead";
import { useAnimeScope } from "@/lib/anime";
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

type Notification = {
  id: number;
  title: string;
  message: string;
  time: string;
  unread: boolean;
  type: "critical" | "warning" | "success";
  href: string;
};

const initialNotifications: Notification[] = [
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
];

const severityDot: Record<Notification["type"], string> = {
  critical: "bg-red-500",
  warning: "bg-amber-500",
  success: "bg-emerald-500",
};

const initials = (name: string) =>
  name
    .replace(/^(Sh|Dr|Smt)\.\s*/, "")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

const Avatar = ({ name }: { name: string }) => (
  <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-indigo-500 via-sky-500 to-emerald-400 text-xs font-semibold text-white shadow-[inset_0_1px_0_rgb(255_255_255/0.4),0_4px_12px_-4px_rgb(61_90_254/0.6)]">
    {initials(name)}
  </span>
);

const NavList = ({
  items,
  pathname,
  onNavigate,
}: {
  items: NavItem[];
  pathname: string;
  onNavigate?: () => void;
}) => (
  <nav className="flex flex-col gap-1">
    {items.map((item) => {
      const Icon = item.icon;
      const active =
        pathname === item.href || pathname.startsWith(`${item.href}/`);
      return (
        <Link
          className={`group flex items-center gap-3 rounded-2xl px-3 py-2.5 text-[13px] transition-all duration-200 ease-glass ${
            active
              ? "bg-white font-semibold text-ink shadow-[0_1px_2px_rgb(15_23_42/0.06),0_8px_20px_-10px_rgb(30_41_90/0.35)]"
              : "text-ink-muted hover:bg-white/55 hover:text-ink"
          }`}
          data-nav-item
          href={item.href}
          key={item.href}
          onClick={onNavigate}
        >
          <span
            className={`flex size-8 shrink-0 items-center justify-center rounded-xl transition-colors ${
              active
                ? "btn-ink"
                : "bg-white/50 text-ink/70 group-hover:bg-white group-hover:text-ink"
            }`}
          >
            <Icon className="size-4" aria-hidden />
          </span>
          <span className="flex-1">{item.label}</span>
          {item.badge ? (
            <span className="num flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-[0_2px_8px_-2px_rgb(239_68_68/0.7)]">
              {item.badge}
            </span>
          ) : null}
        </Link>
      );
    })}
  </nav>
);

const HelpCard = () => (
  <div className="aurora-dark relative overflow-hidden rounded-2xl p-4 text-white">
    <span
      aria-hidden
      className="absolute -right-8 -top-8 size-28 rounded-full bg-sky-400/40 blur-2xl"
      data-help-glow
    />
    <Headphones className="size-4.5 text-white/80" aria-hidden />
    <p className="mt-2 text-xs font-medium text-white/70">
      Departmental helpdesk
    </p>
    <p className="num mt-0.5 text-lg font-semibold">1800-11-4000</p>
    <p className="mt-0.5 text-[10px] text-white/55">Mon–Sat · 9 AM – 6 PM</p>
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
  const [notifications, setNotifications] = useState(initialNotifications);
  const unreadCount = notifications.filter((item) => item.unread).length;

  const shell = useAnimeScope<HTMLDivElement>(() => {
    animate("[data-nav-item]", {
      translateX: [-18, 0],
      opacity: [0, 1],
      duration: 700,
      delay: stagger(60, { start: 150 }),
      ease: "outExpo",
    });
    animate("[data-bell]", {
      keyframes: [
        { rotate: 16 },
        { rotate: -14 },
        { rotate: 10 },
        { rotate: -6 },
        { rotate: 0 },
      ],
      duration: 900,
      delay: 1200,
      loop: true,
      loopDelay: 6000,
      ease: "inOutSine",
    });
    animate("[data-help-glow]", {
      opacity: [0.35, 0.8],
      scale: [0.9, 1.15],
      duration: 2600,
      loop: true,
      alternate: true,
      ease: "inOutSine",
    });
  });

  return (
    <div className="flex min-h-screen flex-col" ref={shell}>
      <GovStrip />
      <Masthead
        right={
          <div className="flex items-center gap-1.5 sm:gap-2">
            <div className="hidden items-center gap-2 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-xs text-ink-muted md:flex">
              <Search className="size-3.5" aria-hidden />
              <span className="w-36">Search records…</span>
              <kbd className="rounded-md border border-line bg-white/70 px-1.5 font-mono text-[10px]">
                /
              </kbd>
            </div>
            <span className="hidden rounded-full bg-navy-500/10 px-2.5 py-1 text-[11px] font-semibold text-navy-500 lg:inline">
              {portalName}
            </span>

            {/* Notifications */}
            <div className="relative">
              <button
                aria-expanded={notificationsOpen}
                aria-label="Notifications"
                className="relative rounded-full p-2 text-ink transition-colors hover:bg-white/70"
                onClick={() => {
                  setNotificationsOpen((value) => !value);
                  setMenuOpen(false);
                }}
                type="button"
              >
                <Bell className="size-4.5" aria-hidden data-bell />
                {unreadCount > 0 ? (
                  <span className="num absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white">
                    {unreadCount}
                  </span>
                ) : null}
              </button>

              {notificationsOpen ? (
                <>
                  <button
                    aria-label="Close notifications"
                    className="fixed inset-0 z-40 cursor-default"
                    onClick={() => setNotificationsOpen(false)}
                    type="button"
                  />
                  <div className="glass-strong absolute right-0 top-full z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-3xl">
                    <div className="flex items-center justify-between border-b border-line-soft px-4 py-3">
                      <div>
                        <p className="text-sm font-semibold text-ink">
                          Notifications
                        </p>
                        <p className="text-[11px] text-ink-muted">
                          Recent alerts and updates
                        </p>
                      </div>
                      {unreadCount > 0 ? (
                        <button
                          className="rounded-full px-2.5 py-1 text-[11px] font-semibold text-navy-500 transition-colors hover:bg-navy-500/10"
                          onClick={() =>
                            setNotifications((current) =>
                              current.map((item) => ({
                                ...item,
                                unread: false,
                              })),
                            )
                          }
                          type="button"
                        >
                          Mark all read
                        </button>
                      ) : null}
                    </div>

                    <div className="max-h-96 space-y-1 overflow-y-auto p-2">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-8 text-center text-sm text-ink-muted">
                          No notifications
                        </p>
                      ) : (
                        notifications.map((notification) => (
                          <Link
                            className={`flex gap-3 rounded-2xl px-3 py-3 transition-colors hover:bg-white ${
                              notification.unread ? "bg-white/60" : ""
                            }`}
                            href={notification.href}
                            key={notification.id}
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
                          >
                            <span
                              className={`mt-1.5 size-2 shrink-0 rounded-full ${severityDot[notification.type]}`}
                            />
                            <span className="min-w-0 flex-1">
                              <span className="flex items-start justify-between gap-2">
                                <span
                                  className={`text-xs ${
                                    notification.unread
                                      ? "font-semibold text-ink"
                                      : "font-medium text-ink-muted"
                                  }`}
                                >
                                  {notification.title}
                                </span>
                                {notification.unread ? (
                                  <span className="mt-1 size-1.5 shrink-0 rounded-full bg-navy-500" />
                                ) : null}
                              </span>
                              <span className="mt-0.5 block text-[11px] leading-4 text-ink-muted">
                                {notification.message}
                              </span>
                              <span className="mt-1 block text-[10px] text-ink-muted">
                                {notification.time}
                              </span>
                            </span>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                </>
              ) : null}
            </div>

            {/* Session user / logout menu */}
            <div className="relative">
              <button
                aria-expanded={menuOpen}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full p-0.5 pr-1 transition-colors hover:bg-white/70 sm:pr-2"
                onClick={() => {
                  setMenuOpen((value) => !value);
                  setNotificationsOpen(false);
                }}
                type="button"
              >
                <Avatar name={displayName} />
                <span className="hidden text-left leading-4 sm:block">
                  <span className="block text-xs font-semibold text-ink">
                    {displayName}
                  </span>
                  <span className="block text-[10px] text-ink-muted">
                    {user.role}
                  </span>
                </span>
                <ChevronDown
                  className="hidden size-3.5 text-ink-muted sm:block"
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
                    className="glass-strong absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl p-1.5"
                    role="menu"
                  >
                    <button
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-semibold text-red-600 transition-colors hover:bg-red-500/10"
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

      <div className="mx-auto flex w-full max-w-360 flex-1 gap-4 px-3 pt-4 sm:px-4">
        <aside className="sticky top-20 hidden h-[calc(100vh-6rem)] w-64 shrink-0 lg:block">
          <div className="glass flex h-full flex-col justify-between gap-4 overflow-y-auto rounded-3xl p-3">
            <div>
              <div className="mb-3 rounded-2xl bg-white/45 px-3 py-3">
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-ink-muted">
                  {portalName}
                </p>
                <p className="mt-1 text-sm font-semibold text-ink">
                  {displayName}
                </p>
                <p className="text-[11px] text-ink-muted">{user.meta}</p>
              </div>
              <NavList items={items} pathname={pathname} />
            </div>
            <div className="space-y-2">
              <HelpCard />
              <button
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs text-ink-muted transition-colors hover:bg-white/55 hover:text-ink"
                onClick={logout}
                type="button"
              >
                <LogOut className="size-4" aria-hidden />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <main className="w-full min-w-0 flex-1 pb-28 pt-1 lg:pb-10" id="main">
          {children}
        </main>
      </div>

      <button
        aria-label="Open portal menu"
        className="btn-ink fixed bottom-5 left-1/2 z-40 flex -translate-x-1/2 items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu className="size-4.5" aria-hidden />
        Menu
      </button>

      {open ? (
        <>
          <button
            aria-label="Close portal menu"
            className="fixed inset-0 z-40 bg-navy-900/25 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
            type="button"
          />
          <aside className="glass-strong fixed inset-x-3 bottom-3 z-50 flex max-h-[80vh] flex-col gap-3 overflow-y-auto rounded-3xl p-3 lg:hidden">
            <div className="flex items-center justify-between gap-3 px-1">
              <div className="flex items-center gap-2.5">
                <Avatar name={displayName} />
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {displayName}
                  </p>
                  <p className="text-[11px] text-ink-muted">{user.meta}</p>
                </div>
              </div>
              <button
                aria-label="Close"
                className="rounded-full bg-white/60 p-2 hover:bg-white"
                onClick={() => setOpen(false)}
                type="button"
              >
                <X className="size-4.5" aria-hidden />
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
