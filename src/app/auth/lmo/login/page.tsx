import { Fingerprint, Lock, MapPinned, ShieldCheck } from "lucide-react";
import { LoginPanel } from "@/components/auth/LoginPanel";

export const metadata = { title: "Officer Login" };

const controls = [
  {
    icon: MapPinned,
    title: "Jurisdiction bound",
    body: "You can only act on instruments notified to your circle. Cross-district action needs a Controller override.",
  },
  {
    icon: Lock,
    title: "Two-factor mandatory",
    body: "Government ID plus a rotating authenticator code. Sessions expire after 30 minutes of inactivity.",
  },
  {
    icon: Fingerprint,
    title: "Every action is signed",
    body: "Stamping, rejection and seal replacement are written to an append-only audit log with your officer ID.",
  },
];

const LmoLoginPage = () => (
  <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:py-14">
    <section className="order-2 lg:order-1">
      <span className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-navy/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy">
        <ShieldCheck className="size-3.5" aria-hidden />
        Restricted — Departmental Use
      </span>
      <h1 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-3xl">
        Legal Metrology Officer sign-in
      </h1>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        Access is logged. Unauthorised use of this system is an offence under
        the Information Technology Act, 2000.
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
      <LoginPanel
        demoIdentifier="LMO/PRY/04"
        destination="/lmo/dashboard"
        districts={[
          "Prayagraj — Sadar Circle",
          "Prayagraj — Naini Circle",
          "Kaushambi",
          "Pratapgarh",
        ]}
        modes={[
          {
            id: "govid",
            label: "Officer ID",
            placeholder: "e.g. LMO/PRY/04",
            hint: "As printed on your departmental identity card.",
          },
          {
            id: "eoffice",
            label: "e-Office SSO",
            placeholder: "name@up.gov.in",
            hint: "Single sign-on through the state e-Office directory.",
          },
        ]}
        twoFactor
      />
    </section>
  </div>
);

export default LmoLoginPage;
