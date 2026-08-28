import {
  CalendarPlus,
  FileCheck2,
  PlusSquare,
  QrCode,
  ReceiptIndianRupee,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { Panel } from "@/components/ui/Panel";

const actions = [
  {
    label: "Register instrument",
    href: "/business/instruments/register",
    icon: PlusSquare,
  },
  {
    label: "Book verification",
    href: "/business/requests/new",
    icon: CalendarPlus,
  },
  {
    label: "Re-verify a scale",
    href: "/business/instruments/LM-UP-PRY-000124/re-verify",
    icon: RotateCcw,
  },
  {
    label: "Certificate vault",
    href: "/business/certificates",
    icon: FileCheck2,
  },
  {
    label: "Pay pending fee",
    href: "/business/payments",
    icon: ReceiptIndianRupee,
  },
  {
    label: "Print QR stickers",
    href: "/business/certificates",
    icon: QrCode,
  },
];

const QuickActions = () => (
  <Panel
    bodyClassName="grid grid-cols-2 gap-2.5 p-4 sm:grid-cols-3"
    title="Quick actions"
  >
    {actions.map((action) => {
      const Icon = action.icon;
      return (
        <Link
          className="flex flex-col items-center gap-2 rounded-gov border border-line px-2 py-4 text-center text-[11px] font-medium leading-4 text-ink transition-colors hover:border-navy hover:bg-surface-alt"
          href={action.href}
          key={action.label}
        >
          <Icon className="size-5 text-navy" aria-hidden />
          {action.label}
        </Link>
      );
    })}
  </Panel>
);

export default QuickActions;
