import {
  ArrowRight,
  Building2,
  ShieldCheck,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";

export const metadata = { title: "Sign in" };

const options = [
  {
    icon: Building2,
    title: "Trader / Business",
    body: "OTP sign-in with GSTIN, trade licence number or registered mobile.",
    href: "/auth/business/login",
  },
  {
    icon: UserCog,
    title: "Legal Metrology Officer",
    body: "Government ID with two-factor authentication and jurisdiction selection.",
    href: "/auth/lmo/login",
  },
  {
    icon: ShieldCheck,
    title: "Controller / Administration",
    body: "State and central command analytics, e-challans and enforcement triage.",
    href: "/auth/admin/login",
  },
];

const AuthLandingPage = () => (
  <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 sm:py-14">
    <h1 className="font-serif text-2xl font-bold text-ink sm:text-3xl">
      Sign in to the verification network
    </h1>
    <p className="mt-1.5 text-sm text-ink-muted">
      Select the role you hold. Citizens do not need an account — scanning a QR
      sticker is enough.
    </p>

    <div className="mt-6 divide-y divide-line overflow-hidden rounded-gov border border-line bg-surface">
      {options.map((option) => {
        const Icon = option.icon;
        return (
          <Link
            className="group flex items-center gap-4 px-5 py-5 transition-colors hover:bg-surface-alt"
            href={option.href}
            key={option.title}
          >
            <span className="flex size-11 shrink-0 items-center justify-center rounded-gov bg-navy/8 text-navy">
              <Icon className="size-5" aria-hidden />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-sm font-semibold text-ink">
                {option.title}
              </span>
              <span className="mt-0.5 block text-[13px] text-ink-muted">
                {option.body}
              </span>
            </span>
            <ArrowRight
              className="size-4 shrink-0 text-ink-muted transition-transform group-hover:translate-x-1 group-hover:text-navy"
              aria-hidden
            />
          </Link>
        );
      })}
    </div>

    <div className="mt-5 flex items-start gap-3 rounded-gov border border-line bg-surface-alt p-4">
      <Users className="mt-0.5 size-5 shrink-0 text-navy" aria-hidden />
      <p className="text-[13px] leading-5 text-ink-muted">
        Are you a consumer?{" "}
        <Link
          className="font-semibold text-navy-500 hover:underline"
          href="/verify/LM-UP-PRY-000123"
        >
          Verify a shop&apos;s scale
        </Link>{" "}
        or{" "}
        <Link
          className="font-semibold text-navy-500 hover:underline"
          href="/report-fraud"
        >
          report a faulty one
        </Link>{" "}
        without signing in.
      </p>
    </div>
  </div>
);

export default AuthLandingPage;
