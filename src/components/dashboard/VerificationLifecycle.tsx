import { Calendar, Check, FileText, UserRound } from "lucide-react";

const steps = [
  {
    title: "1. Application",
    subtitle: "Submitted",
    date: "18 May 2025",
    icon: Check,
    state: "done",
  },
  {
    title: "2. Document",
    subtitle: "Verified",
    date: "19 May 2025",
    icon: Check,
    state: "done",
  },
  {
    title: "3. Schedule",
    subtitle: "",
    date: "22 May 2025",
    icon: Calendar,
    state: "current",
  },
  {
    title: "4. Verification",
    subtitle: "Pending",
    date: "",
    icon: UserRound,
    state: "upcoming",
  },
  {
    title: "5. Certificate",
    subtitle: "To be issued",
    date: "",
    icon: FileText,
    state: "upcoming",
  },
];

const circleStyles: Record<string, string> = {
  done: "bg-emerald-500 text-white",
  current: "bg-gov-accent text-white",
  upcoming: "bg-slate-200 text-slate-500",
};

const VerificationLifecycle = () => {
  return (
    <section className="rounded-lg border border-slate-200 bg-white">
      <div className="border-b border-slate-200 px-4 py-3">
        <h2 className="text-sm font-semibold text-slate-900">
          Verification Lifecycle
        </h2>
      </div>

      <div className="w-full overflow-x-auto">
        <ol className="flex min-w-2xl items-start px-4 py-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <li className="flex flex-1 items-start" key={step.title}>
                <div className="flex w-full flex-col items-center text-center">
                  <span
                    className={`flex size-9 items-center justify-center rounded-full ${circleStyles[step.state]}`}
                  >
                    <Icon className="size-4.5" aria-hidden />
                  </span>
                  <p className="mt-2 text-xs font-semibold text-slate-900">
                    {step.title}
                  </p>
                  {step.subtitle ? (
                    <p className="text-[11px] text-slate-600">
                      {step.subtitle}
                    </p>
                  ) : null}
                  {step.date ? (
                    <p className="text-[11px] text-slate-500">{step.date}</p>
                  ) : null}
                </div>

                {index < steps.length - 1 ? (
                  <span
                    aria-hidden
                    className={`mt-4.5 -mx-[50%] h-0.5 w-full ${
                      step.state === "done" ? "bg-emerald-500" : "bg-slate-200"
                    }`}
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};

export default VerificationLifecycle;
