import {
  CalendarCheck,
  Check,
  FileSignature,
  Stamp,
  UserCheck,
} from "lucide-react";
import { Panel } from "@/components/ui/Panel";

const steps = [
  {
    title: "Application filed",
    date: "18 May 2025",
    icon: Check,
    state: "done" as const,
  },
  {
    title: "Documents verified",
    date: "19 May 2025",
    icon: FileSignature,
    state: "done" as const,
  },
  {
    title: "Inspection scheduled",
    date: "22 May 2025, 11:00 AM",
    icon: CalendarCheck,
    state: "current" as const,
  },
  {
    title: "Field verification",
    date: "Geo-fenced stamping",
    icon: UserCheck,
    state: "upcoming" as const,
  },
  {
    title: "Certificate & QR seal",
    date: "Issued on pass",
    icon: Stamp,
    state: "upcoming" as const,
  },
];

const dot = {
  done: "bg-india-green text-white",
  current: "bg-navy text-white ring-4 ring-navy/15",
  upcoming: "border border-line bg-surface text-ink-muted",
};

const VerificationLifecycle = () => (
  <Panel
    hint="Application APP2025001187 · Platform Scale"
    title="Where your request stands"
  >
    <div className="w-full overflow-x-auto">
      <ol className="flex min-w-2xl items-start">
        {steps.map((step, index) => {
          const Icon = step.icon;
          return (
            <li className="flex flex-1 items-start" key={step.title}>
              <div className="flex w-full flex-col items-center px-1 text-center">
                <span
                  className={`flex size-9 items-center justify-center rounded-full ${dot[step.state]}`}
                >
                  <Icon className="size-4" aria-hidden />
                </span>
                <p className="mt-2 text-[12px] font-semibold leading-4 text-ink">
                  {step.title}
                </p>
                <p className="num mt-0.5 text-[11px] leading-4 text-ink-muted">
                  {step.date}
                </p>
              </div>

              {index < steps.length - 1 ? (
                <span
                  aria-hidden
                  className={`-mx-[50%] mt-4.5 h-0.5 w-full ${
                    step.state === "done" ? "bg-india-green" : "bg-line"
                  }`}
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </div>
  </Panel>
);

export default VerificationLifecycle;
