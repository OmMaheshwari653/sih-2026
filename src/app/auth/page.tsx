import { ArrowUpRight, ScanLine } from "lucide-react";
import Link from "next/link";
import { OfficerArt, TraderArt } from "@/components/illustrations/RoleArt";
import { GaugeArt } from "@/components/illustrations/StepArt";

export const metadata = { title: "Sign in" };

const options = [
  {
    art: <TraderArt className="h-36 w-auto" />,
    title: "Trader / Business",
    body: "OTP sign-in with GSTIN, trade licence number or registered mobile.",
    href: "/auth/business/login",
    tint: "from-indigo-100/80 to-sky-50/40",
  },
  {
    art: <OfficerArt className="h-36 w-auto" />,
    title: "Legal Metrology Officer",
    body: "Government ID with two-factor authentication and jurisdiction selection.",
    href: "/auth/lmo/login",
    tint: "from-emerald-100/80 to-teal-50/40",
  },
  {
    art: <GaugeArt className="size-32" />,
    title: "Controller / Administration",
    body: "State and central command analytics, e-challans and enforcement triage.",
    href: "/auth/admin/login",
    tint: "from-orange-100/80 to-amber-50/40",
  },
];

const AuthLandingPage = () => (
  <div className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
    <div className="mx-auto max-w-2xl text-center">
      <p
        className="text-xs font-medium uppercase tracking-[0.14em] text-navy-500"
        data-reveal
      >
        Sign in
      </p>
      <h1
        className="mt-3 text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
        data-split="lines"
      >
        Sign in to the verification network
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-ink-muted" data-reveal>
        Select the role you hold. Citizens do not need an account — scanning a
        QR sticker is enough.
      </p>
    </div>

    <div className="mt-12 grid gap-4 md:grid-cols-3">
      {options.map((option) => (
        <Link
          className="glass spotlight group flex flex-col overflow-hidden rounded-4xl transition-shadow duration-500 hover:shadow-[0_40px_80px_-30px_rgb(30_41_90/0.35)]"
          data-tilt="6"
          href={option.href}
          key={option.title}
        >
          <div
            className={`relative m-2 flex h-44 items-center justify-center overflow-hidden rounded-3xl bg-linear-to-br ${option.tint}`}
          >
            <span className="transition-transform duration-700 ease-glass group-hover:scale-110">
              {option.art}
            </span>
            <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/80 text-ink-muted shadow-sm transition-all duration-500 ease-glass group-hover:rotate-45 group-hover:bg-ink group-hover:text-white">
              <ArrowUpRight className="size-4" aria-hidden />
            </span>
          </div>
          <div className="px-6 pb-6 pt-3">
            <h2 className="text-lg font-semibold text-ink">{option.title}</h2>
            <p className="mt-1.5 text-sm leading-6 text-ink-muted">
              {option.body}
            </p>
          </div>
        </Link>
      ))}
    </div>

    <div
      className="glass-strong mx-auto mt-6 flex max-w-2xl flex-col items-center gap-3 rounded-4xl p-4 text-center sm:flex-row sm:rounded-full sm:py-2.5 sm:pl-5 sm:pr-2.5 sm:text-left"
      data-reveal
    >
      <p className="flex-1 text-sm text-ink-muted">
        Are you a consumer? Check a shop&apos;s scale or{" "}
        <Link
          className="font-semibold text-navy-500 hover:underline"
          href="/report-fraud"
        >
          report a faulty one
        </Link>{" "}
        without signing in.
      </p>
      <Link
        className="btn-ink inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:brightness-125"
        data-magnetic="0.25"
        href="/verify"
      >
        <ScanLine className="size-4" aria-hidden />
        Scan a scale
      </Link>
    </div>
  </div>
);

export default AuthLandingPage;
