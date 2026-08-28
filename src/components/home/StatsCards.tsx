import {
  ArrowRight,
  CircleAlert,
  CircleCheckBig,
  Clock,
  Copy,
  FileText,
} from "lucide-react";

const stats = [
  { value: 12, label: "Total Instruments", icon: FileText, tone: "sky" },
  {
    value: 9,
    label: "Valid Instruments",
    icon: CircleCheckBig,
    tone: "emerald",
  },
  { value: 2, label: "Expiring Soon", icon: Clock, tone: "amber" },
  { value: 1, label: "Expired Instruments", icon: CircleAlert, tone: "red" },
  { value: 4, label: "Applications", icon: Copy, tone: "violet" },
];

const toneStyles: Record<string, string> = {
  sky: "bg-sky-100 text-sky-600",
  emerald: "bg-emerald-100 text-emerald-600",
  amber: "bg-amber-100 text-amber-600",
  red: "bg-red-100 text-red-600",
  violet: "bg-violet-100 text-violet-600",
};

const StatsCards = () => {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <article
            className="rounded-lg border border-slate-200 bg-white p-4"
            key={stat.label}
          >
            <div className="flex items-center gap-3">
              <span
                className={`flex size-10 items-center justify-center rounded-full ${toneStyles[stat.tone]}`}
              >
                <Icon className="size-5" aria-hidden />
              </span>
              <div>
                <p className="text-2xl font-bold leading-none text-slate-900">
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] text-slate-500">{stat.label}</p>
              </div>
            </div>

            <a
              className="mt-3 flex items-center gap-1 text-[11px] font-medium text-gov-accent hover:underline"
              href="#instruments"
            >
              View All
              <ArrowRight className="size-3" aria-hidden />
            </a>
          </article>
        );
      })}
    </div>
  );
};

export default StatsCards;
