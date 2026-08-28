import {
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarClock,
  ClipboardCheck,
  FileWarning,
  Gavel,
  MapPin,
  Megaphone,
  QrCode,
  Scale,
  ScanLine,
  ShieldCheck,
  Truck,
  UserCog,
  Users,
} from "lucide-react";
import Link from "next/link";
import { LookupBar } from "@/components/public/LookupBar";
import { camps } from "@/lib/data";

const counters = [
  { value: "1,42,08,764", label: "Instruments stamped digitally" },
  { value: "24,915", label: "Field officers on the network" },
  { value: "38,204", label: "Citizen fraud reports actioned" },
  { value: "0", label: "Sheets of manual paperwork" },
];

const roles = [
  {
    title: "I am a Trader / Business",
    body: "Register instruments, book a verification slot, pay the statutory fee and hold every certificate in a digital vault.",
    href: "/auth/business/login",
    cta: "Enter Business Portal",
    icon: Building2,
  },
  {
    title: "I am a Legal Metrology Officer",
    body: "Geo-fenced field stamping, auto-computed permissible error, and instant digital seal allocation from your phone.",
    href: "/auth/lmo/login",
    cta: "Officer Sign-in",
    icon: UserCog,
  },
  {
    title: "I am a Consumer",
    body: "Scan the QR sticker on any shop scale to see whether it is legally stamped — and report it in one tap if it is not.",
    href: "/verify/LM-UP-PRY-000123",
    cta: "Verify a Scale",
    icon: Users,
  },
];

const flow = [
  {
    icon: ClipboardCheck,
    title: "Apply online",
    body: "Trader files a stamping or re-verification request against a specific instrument serial number and pays the fee.",
  },
  {
    icon: MapPin,
    title: "Geo-fenced inspection",
    body: "The Verify action unlocks only when the officer's live GPS is within 50 m of the registered premises.",
  },
  {
    icon: ShieldCheck,
    title: "Auto pass / fail",
    body: "Readings at 10%, 50% and 100% test loads are checked against the Maximum Permissible Error for the accuracy class.",
  },
  {
    icon: QrCode,
    title: "Digital seal issued",
    body: "A tamper-evident QR seal is bound to the record. Any citizen can scan it and read the same audit trail.",
  },
];

const rights = [
  {
    heading: "Permissible error is not a licence to under-weigh",
    body: "For a Class III retail scale of 30 kg capacity with a verification interval e = 10 g, the maximum permissible error in service is ±1e up to 500e. Anything beyond that is an offence.",
  },
  {
    heading: "Packaged goods must be sold on net weight",
    body: "Under the Legal Metrology (Packaged Commodities) Rules, 2011 the price you pay must relate to the net quantity — the weight of the packaging cannot be charged to you.",
  },
  {
    heading: "You may demand to see the stamping certificate",
    body: "Every verified instrument carries a valid seal and certificate. A trader refusing inspection of it can be reported directly from this portal.",
  },
  {
    heading: "Penalties under the Act",
    body: "Use of an unverified or tampered instrument attracts penalties under Sections 25 and 33 of the Legal Metrology Act, 2009, including compounding fees and prosecution for repeat offences.",
  },
];

const notices = [
  "Tatkal re-verification window for fuel dispensers extended till 30 June 2025.",
  "Mobile verification vans deployed across 14 wholesale mandis in Prayagraj division.",
  "Revised verification fee schedule (Notification S.O. 1142/2025) effective 01 April 2025.",
];

const HomePage = () => {
  const activeCamps = camps
    .filter((camp) => camp.state !== "completed")
    .slice(0, 3);

  return (
    <>
      {/* ---------------------------------------------------------------- Hero */}
      <section className="relative overflow-hidden bg-navy text-white">
        <Scale
          aria-hidden
          className="pointer-events-none absolute -right-10 top-1/2 size-[26rem] -translate-y-1/2 text-white/4"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:repeating-linear-gradient(90deg,#fff_0_1px,transparent_1px_64px)]"
        />

        <div className="relative mx-auto grid w-full max-w-360 gap-9 px-4 py-12 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-saffron/40 bg-saffron/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-saffron">
              <BadgeCheck className="size-3.5" aria-hidden />
              Legal Metrology Act, 2009 · Digital Compliance
            </p>

            <h1 className="mt-4 font-serif text-3xl font-bold leading-[1.15] sm:text-4xl lg:text-[2.75rem]">
              Every weighing scale in India,
              <span className="text-saffron"> verifiable in one scan.</span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-white/75 sm:text-base">
              A single ecosystem connecting traders, Legal Metrology Officers
              and citizens — replacing lead seals, paper diaries and desk-issued
              certificates with geo-fenced inspections and a public audit trail.
            </p>

            <div className="mt-6 max-w-2xl">
              <LookupBar />
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                className="inline-flex items-center gap-2 rounded-gov bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-white/90"
                href="/report-fraud"
              >
                <FileWarning className="size-4" aria-hidden />
                Report an under-weighing shop
              </Link>
              <Link
                className="inline-flex items-center gap-2 rounded-gov border border-white/25 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10"
                href="/camps"
              >
                <Truck className="size-4" aria-hidden />
                Find a verification camp
              </Link>
            </div>
          </div>

          <div className="self-center rounded-gov border border-white/15 bg-white/6 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-saffron">
              National Position · FY 2024–25
            </p>
            <dl className="mt-4 divide-y divide-white/12">
              {counters.map((counter) => (
                <div
                  className="flex items-baseline justify-between gap-4 py-3"
                  key={counter.label}
                >
                  <dd className="num text-2xl font-bold sm:text-3xl">
                    {counter.value}
                  </dd>
                  <dt className="text-right text-[11px] leading-4 text-white/65">
                    {counter.label}
                  </dt>
                </div>
              ))}
            </dl>
            <p className="mt-3 text-[10px] text-white/45">
              Indicative prototype figures compiled for demonstration.
            </p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- Notices */}
      <section className="border-b border-line bg-amber-50">
        <div className="mx-auto flex w-full max-w-360 flex-col gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-4 sm:px-6">
          <span className="inline-flex w-fit items-center gap-1.5 rounded-[3px] bg-navy px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
            <Megaphone className="size-3" aria-hidden />
            Notices
          </span>
          <ul className="flex flex-1 flex-col gap-1 text-xs text-ink sm:flex-row sm:flex-wrap sm:gap-x-6">
            {notices.map((notice) => (
              <li className="sm:list-disc sm:first:list-none" key={notice}>
                {notice}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* --------------------------------------------------------- Role picker */}
      <section className="mx-auto w-full max-w-360 px-4 py-10 sm:px-6">
        <h2 className="font-serif text-2xl font-bold text-ink">
          Choose how you want to use the portal
        </h2>
        <p className="mt-1 text-sm text-ink-muted">
          Three interfaces, one verification record.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <Link
                className="group flex flex-col rounded-gov border border-line bg-surface p-5 transition-colors hover:border-navy"
                href={role.href}
                key={role.title}
              >
                <span className="flex size-11 items-center justify-center rounded-gov bg-navy/8 text-navy">
                  <Icon className="size-5.5" aria-hidden />
                </span>
                <h3 className="mt-3.5 text-base font-semibold text-ink">
                  {role.title}
                </h3>
                <p className="mt-1.5 flex-1 text-[13px] leading-5 text-ink-muted">
                  {role.body}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-500 group-hover:gap-2.5">
                  {role.cta}
                  <ArrowRight className="size-3.5 transition-all" aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------ How flow */}
      <section className="border-y border-line bg-surface">
        <div className="mx-auto w-full max-w-360 px-4 py-10 sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-ink">
            How a fraud-proof verification works
          </h2>

          <ol className="mt-6 grid gap-px overflow-hidden rounded-gov border border-line bg-line md:grid-cols-2 xl:grid-cols-4">
            {flow.map((step, index) => {
              const Icon = step.icon;
              return (
                <li className="bg-surface p-5" key={step.title}>
                  <div className="flex items-center gap-2.5">
                    <span className="num flex size-7 items-center justify-center rounded-full bg-navy text-xs font-bold text-white">
                      {index + 1}
                    </span>
                    <Icon className="size-4.5 text-navy-500" aria-hidden />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold text-ink">
                    {step.title}
                  </h3>
                  <p className="mt-1.5 text-[13px] leading-5 text-ink-muted">
                    {step.body}
                  </p>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- Camps + QR */}
      <section className="mx-auto grid w-full max-w-360 gap-4 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_20rem]">
        <div className="rounded-gov border border-line bg-surface">
          <header className="flex items-center justify-between border-b border-line-soft px-4 py-3">
            <div className="border-l-[3px] border-navy pl-2.5">
              <h2 className="text-sm font-semibold text-ink">
                Mobile verification camps this week
              </h2>
              <p className="text-[11px] text-ink-muted">
                Street vendors and mandi stalls can get stamped on the spot.
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-1 text-xs font-semibold text-navy-500 hover:underline"
              href="/camps"
            >
              All camps
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </header>

          <ul className="divide-y divide-line-soft">
            {activeCamps.map((camp) => (
              <li
                className="flex flex-wrap items-center justify-between gap-3 px-4 py-3.5"
                key={camp.id}
              >
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {camp.market}
                  </p>
                  <p className="text-[11px] text-ink-muted">
                    {camp.district} · {camp.day}, {camp.date} · {camp.window} ·
                    Van {camp.van}
                  </p>
                </div>
                <span
                  className={`rounded-[3px] border px-2 py-0.5 text-[11px] font-semibold ${
                    camp.state === "active"
                      ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                      : "border-line bg-surface-alt text-ink-muted"
                  }`}
                >
                  {camp.state === "active" ? "Active now" : "Upcoming"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-gov border border-line bg-navy p-5 text-white">
          <ScanLine className="size-6 text-saffron" aria-hidden />
          <h2 className="mt-3 font-serif text-lg font-bold">
            Standing at a shop right now?
          </h2>
          <p className="mt-1.5 text-[13px] leading-5 text-white/75">
            Point your phone camera at the green QR sticker pasted on the scale.
            You will see the stamping date, the officer who verified it and the
            expiry — before you pay.
          </p>
          <Link
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-gov bg-white px-4 py-2.5 text-sm font-semibold text-navy hover:bg-white/90"
            href="/verify/LM-UP-PRY-000123"
          >
            <QrCode className="size-4" aria-hidden />
            Open a sample verification
          </Link>
          <Link
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-gov border border-white/25 px-4 py-2.5 text-sm font-semibold hover:bg-white/10"
            href="/gatekeeper/scan"
          >
            Mandi gatekeeper mode
          </Link>
        </div>
      </section>

      {/* -------------------------------------------------------------- Rights */}
      <section className="border-t border-line bg-surface-alt" id="rights">
        <div className="mx-auto w-full max-w-360 px-4 py-10 sm:px-6">
          <div className="flex items-center gap-2.5">
            <Gavel className="size-5 text-navy" aria-hidden />
            <h2 className="font-serif text-2xl font-bold text-ink">
              Know your rights
            </h2>
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            What the law guarantees you at the counter.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {rights.map((right) => (
              <article
                className="rounded-gov border border-line bg-surface p-5"
                key={right.heading}
              >
                <h3 className="text-sm font-semibold text-ink">
                  {right.heading}
                </h3>
                <p className="mt-2 text-[13px] leading-5.5 text-ink-muted">
                  {right.body}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3 rounded-gov border border-navy/20 bg-navy/5 px-4 py-3.5">
            <CalendarClock className="size-5 text-navy" aria-hidden />
            <p className="flex-1 text-[13px] text-ink">
              Instrument validity is typically one year. The portal notifies the
              trader 30 days before expiry — and flags the instrument publicly
              the day after.
            </p>
            <Link
              className="rounded-gov bg-navy px-4 py-2 text-xs font-semibold text-white hover:bg-navy-700"
              href="/business/dashboard"
            >
              See a trader dashboard
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
