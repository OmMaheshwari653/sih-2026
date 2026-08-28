"use client";

import {
  Bell,
  ChevronDown,
  ClipboardList,
  FileCheck2,
  FilePlus2,
  Headphones,
  LayoutDashboard,
  LifeBuoy,
  Menu,
  MessageSquareWarning,
  Scale,
  Wallet,
  X,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Instruments", icon: Scale },
  { label: "Apply for Verification", icon: FilePlus2 },
  { label: "Applications", icon: ClipboardList, expandable: true },
  { label: "Certificates", icon: FileCheck2 },
  { label: "Payments", icon: Wallet },
  { label: "Notifications", icon: Bell, badge: 3 },
  { label: "Complaints", icon: MessageSquareWarning },
  { label: "Help & Support", icon: LifeBuoy },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => (
  <>
    <nav className="flex flex-col gap-1 p-3">
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <button
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
              item.active
                ? "bg-white/15 font-semibold"
                : "text-white/85 hover:bg-white/10"
            }`}
            key={item.label}
            onClick={onNavigate}
            type="button"
          >
            <Icon className="size-4.5 shrink-0" aria-hidden />
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge ? (
              <span className="flex size-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold">
                {item.badge}
              </span>
            ) : null}
            {item.expandable ? (
              <ChevronDown className="size-4 text-white/70" aria-hidden />
            ) : null}
          </button>
        );
      })}
    </nav>

    <div className="m-3 rounded-lg bg-white/10 p-4 text-center">
      <Headphones className="mx-auto size-6 text-white" aria-hidden />
      <p className="mt-2 text-sm font-semibold">Need Help?</p>
      <p className="text-[11px] text-white/75">Toll Free Number</p>
      <p className="mt-1 text-lg font-bold tracking-wide">1800-11-4000</p>
      <p className="mt-1 text-[10px] text-white/70">
        Mon to Sat : 9:00 AM - 6:00 PM
      </p>
    </div>
  </>
);

const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <aside className="hidden w-60 shrink-0 flex-col justify-between bg-gov-navy text-white lg:flex">
        <SidebarContent />
      </aside>

      <button
        aria-label="Open menu"
        className="fixed bottom-5 left-5 z-40 flex size-12 items-center justify-center rounded-full bg-gov-navy text-white shadow-lg lg:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <Menu className="size-5" aria-hidden />
      </button>

      {open ? (
        <>
          <button
            aria-label="Close menu"
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
            onClick={() => setOpen(false)}
            type="button"
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col justify-between overflow-y-auto bg-gov-navy text-white lg:hidden">
            <div>
              <div className="flex justify-end p-3 pb-0">
                <button
                  aria-label="Close menu"
                  className="rounded p-1 hover:bg-white/10"
                  onClick={() => setOpen(false)}
                  type="button"
                >
                  <X className="size-5" aria-hidden />
                </button>
              </div>
              <SidebarContent onNavigate={() => setOpen(false)} />
            </div>
          </aside>
        </>
      ) : null}
    </>
  );
};

export default Sidebar;
