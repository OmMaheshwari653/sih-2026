import {
  CreditCard,
  FileCheck2,
  FilePlus2,
  Megaphone,
  Scale,
} from "lucide-react";

const actions = [
  { label: "Apply for Verification", icon: FilePlus2 },
  { label: "My Instruments", icon: Scale },
  { label: "View Certificates", icon: FileCheck2 },
  { label: "Make Payment", icon: CreditCard },
  { label: "Raise Complaint", icon: Megaphone },
];

const QuickActions = () => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">Quick Actions</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 xl:grid-cols-5">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              className="flex flex-col items-center gap-2 rounded-md border border-slate-200 px-2 py-4 text-[11px] font-medium text-slate-700 transition-colors hover:border-gov-accent hover:bg-slate-50"
              key={action.label}
              type="button"
            >
              <Icon className="size-5 text-gov-accent" aria-hidden />
              <span className="text-center leading-4">{action.label}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;
