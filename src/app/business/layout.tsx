"use client";

import {
  CalendarPlus,
  FileCheck2,
  LayoutDashboard,
  ReceiptIndianRupee,
  RotateCcw,
  Scale,
} from "lucide-react";
import { PortalShell } from "@/components/shared/PortalShell";

const items = [
  { label: "Dashboard", href: "/business/dashboard", icon: LayoutDashboard },
  { label: "My Instruments", href: "/business/instruments", icon: Scale },
  {
    label: "Book Verification",
    href: "/business/requests/new",
    icon: CalendarPlus,
  },
  {
    label: "Re-verification",
    href: "/business/instruments/LM-UP-PRY-000124/re-verify",
    icon: RotateCcw,
  },
  {
    label: "Certificate Vault",
    href: "/business/certificates",
    icon: FileCheck2,
  },
  {
    label: "Payments",
    href: "/business/payments",
    icon: ReceiptIndianRupee,
    badge: 2,
  },
];

export default function BusinessLayout({ children }: LayoutProps<"/business">) {
  return (
    <PortalShell
      items={items}
      portalName="Business Portal"
      user={{
        name: "Rajesh Kumar",
        role: "Trader",
        meta: "ABC Traders · Prayagraj",
      }}
    >
      {children}
    </PortalShell>
  );
}
