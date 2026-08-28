"use client";

import { Archive, ClipboardList, LayoutDashboard, Tent } from "lucide-react";
import { PortalShell } from "@/components/shared/PortalShell";

const items = [
  { label: "Today's Route", href: "/lmo/dashboard", icon: LayoutDashboard },
  {
    label: "Inspection Workspace",
    href: "/lmo/inspections/INS-2025-4412",
    icon: ClipboardList,
    badge: 4,
  },
  { label: "Camp Mode", href: "/lmo/camp-mode", icon: Tent },
  { label: "Audit History", href: "/lmo/history", icon: Archive },
];

export default function LmoLayout({ children }: LayoutProps<"/lmo">) {
  return (
    <PortalShell
      items={items}
      portalName="Officer Portal"
      user={{
        name: "Sh. Anil Verma",
        role: "Legal Metrology Officer",
        meta: "LMO/PRY/04 · Sadar Circle",
      }}
    >
      {children}
    </PortalShell>
  );
}
