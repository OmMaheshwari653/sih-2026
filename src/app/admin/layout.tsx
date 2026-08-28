"use client";

import { Gavel, LayoutDashboard, Siren } from "lucide-react";
import { PortalShell } from "@/components/shared/PortalShell";

const items = [
  {
    label: "Command Analytics",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  { label: "E-Challan Feed", href: "/admin/challans", icon: Gavel, badge: 5 },
  {
    label: "Fraud Triage",
    href: "/admin/fraud-reports",
    icon: Siren,
    badge: 4,
  },
];

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return (
    <PortalShell
      items={items}
      portalName="Command Centre"
      user={{
        name: "Dr. S. Mahapatra",
        role: "Controller",
        meta: "Legal Metrology, Uttar Pradesh",
      }}
    >
      {children}
    </PortalShell>
  );
}
