import { BarChart3, ShieldCheck, Siren } from "lucide-react";
import { AdminLoginForm } from "@/components/auth/AdminLoginForm";

export const metadata = { title: "Admin Login" };

const controls = [
  {
    icon: BarChart3,
    title: "State command analytics",
    body: "District compliance, revenue realisation and officer productivity across the network.",
  },
  {
    icon: Siren,
    title: "Enforcement triage",
    body: "Citizen fraud reports prioritised and routed to field officers for surprise raids.",
  },
  {
    icon: ShieldCheck,
    title: "Restricted access",
    body: "Controller and administrative accounts only. Every sign-in and action is logged.",
  },
];

const AdminLoginPage = () => (
  <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:py-14">
    <section className="order-2 lg:order-1">
      <span className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-navy/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy">
        <ShieldCheck className="size-3.5" aria-hidden />
        Restricted — Administration
      </span>
      <h1 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-3xl">
        Command centre sign-in
      </h1>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        Access for the Controller and administrative staff managing the Legal
        Metrology verification network.
      </p>

      <div className="mt-6 space-y-3">
        {controls.map((control) => {
          const Icon = control.icon;
          return (
            <article
              className="flex items-start gap-3 rounded-gov border border-line bg-surface p-4"
              key={control.title}
            >
              <Icon
                className="mt-0.5 size-4.5 shrink-0 text-navy"
                aria-hidden
              />
              <div>
                <h2 className="text-[13px] font-semibold text-ink">
                  {control.title}
                </h2>
                <p className="mt-0.5 text-[12.5px] leading-5 text-ink-muted">
                  {control.body}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>

    <section className="order-1 lg:order-2">
      <AdminLoginForm />
    </section>
  </div>
);

export default AdminLoginPage;
