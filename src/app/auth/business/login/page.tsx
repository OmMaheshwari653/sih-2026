import { CheckCircle2, Store } from "lucide-react";
import { BusinessLoginForm } from "@/components/auth/BusinessLoginForm";

export const metadata = { title: "Trader Login" };

const benefits = [
  "Register every weighing and measuring instrument you operate, across branches.",
  "Book a verification slot and pay the statutory fee online — no office visit.",
  "Automatic reminder 30 days before a stamping expires.",
  "Download certificates and printable hologram stickers any time.",
];

const BusinessLoginPage = () => (
  <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-2 lg:py-14">
    <section className="order-2 lg:order-1">
      <span className="inline-flex items-center gap-2 rounded-full border border-navy/20 bg-navy/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-navy">
        <Store className="size-3.5" aria-hidden />
        Business Portal
      </span>
      <h1 className="mt-3 font-serif text-2xl font-bold text-ink sm:text-3xl">
        Ease of doing business, without the paperwork
      </h1>
      <p className="mt-2 text-sm leading-6 text-ink-muted">
        Sign in with the credentials already tied to your establishment. New
        traders are onboarded automatically after the first successful OTP.
      </p>

      <ul className="mt-5 space-y-3">
        {benefits.map((benefit) => (
          <li
            className="flex items-start gap-2.5 text-[13px] text-ink"
            key={benefit}
          >
            <CheckCircle2
              className="mt-0.5 size-4 shrink-0 text-india-green"
              aria-hidden
            />
            {benefit}
          </li>
        ))}
      </ul>

      <div className="mt-6 rounded-gov border border-line bg-surface-alt p-4 text-[13px] text-ink-muted">
        <p className="font-semibold text-ink">Penalty for non-compliance</p>
        <p className="mt-1 leading-5">
          Trading with an unverified instrument attracts a compounding fee from
          ₹4,000, escalating to prosecution for repeat offences under Section 33
          of the Act.
        </p>
      </div>
    </section>

    <section className="order-1 lg:order-2">
      <BusinessLoginForm />
    </section>
  </div>
);

export default BusinessLoginPage;
