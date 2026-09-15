import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  Megaphone,
  QrCode,
  ScanLine,
  Truck,
} from "lucide-react";
import Link from "next/link";
import { Hero } from "@/components/home/Hero";
import {
  ConsumerArt,
  OfficerArt,
  TraderArt,
} from "@/components/illustrations/RoleArt";
import {
  ApplyArt,
  GaugeArt,
  GeoArt,
  SealArt,
} from "@/components/illustrations/StepArt";
import { Marquee } from "@/components/motion/Marquee";
import { camps } from "@/lib/data";

const roles = [
  {
    title: "Trader / Business",
    body: "Register instruments, book a verification slot, pay the statutory fee and hold every certificate in a digital vault.",
    href: "/auth/business/login",
    cta: "Enter Business Portal",
    art: TraderArt,
    tint: "from-indigo-100/80 to-sky-50/40",
  },
  {
    title: "Legal Metrology Officer",
    body: "Geo-fenced field stamping, auto-computed permissible error, and instant digital seal allocation from your phone.",
    href: "/auth/lmo/login",
    cta: "Officer Sign-in",
    art: OfficerArt,
    tint: "from-emerald-100/80 to-teal-50/40",
  },
  {
    title: "Consumer",
    body: "Scan the QR sticker on any shop scale to see whether it is legally stamped — and report it in one tap if it is not.",
    href: "/verify",
    cta: "Scan a Scale",
    art: ConsumerArt,
    tint: "from-orange-100/80 to-amber-50/40",
  },
];

const flow = [
  {
    art: ApplyArt,
    title: "Apply online",
    body: "Trader files a stamping or re-verification request against a specific instrument serial number and pays the fee.",
  },
  {
    art: GeoArt,
    title: "Geo-fenced inspection",
    body: "The Verify action unlocks only when the officer's live GPS is within 50 m of the registered premises.",
  },
  {
    art: GaugeArt,
    title: "Auto pass / fail",
    body: "Readings at 10%, 50% and 100% test loads are checked against the Maximum Permissible Error for the accuracy class.",
  },
  {
    art: SealArt,
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
  "Tatkal re-verification window for fuel dispensers extended till 30 June 2025",
  "Mobile verification vans deployed across 14 wholesale mandis in Prayagraj division",
  "Revised verification fee schedule (Notification S.O. 1142/2025) effective 01 April 2025",
];

const instrumentsCovered = [
  "Weighing scales",
  "Fuel dispensers",
  "Jewellery balances",
  "Milk fat meters",
  "Platform scales",
  "Taxi meters",
  "Water meters",
  "Weighbridges",
];

const SectionTitle = ({
  eyebrow,
  title,
  body,
  light,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  light?: boolean;
}) => (
  <div className="max-w-2xl">
    <p
      className={`inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.14em] ${light ? "text-sky-300" : "text-navy-500"}`}
      data-reveal
    >
      <span className="h-px w-6 bg-current" />
      {eyebrow}
    </p>
    <h2
      className={`mt-3 text-3xl font-semibold tracking-tight sm:text-5xl ${light ? "text-white" : "text-ink"}`}
      data-split="lines"
    >
      {title}
    </h2>
    {body ? (
      <p
        className={`mt-4 text-[15px] leading-7 ${light ? "text-white/60" : "text-ink-muted"}`}
        data-reveal
      >
        {body}
      </p>
    ) : null}
  </div>
);

const HomePage = () => {
  const activeCamps = camps
    .filter((camp) => camp.state !== "completed")
    .slice(0, 3);

  return (
    <>
      <Hero />

      {/* ------------------------------------------------------------ Tickers */}
      <section className="mx-auto w-full max-w-360 px-3 pt-4 sm:px-4">
        <div className="glass flex items-center gap-3 overflow-hidden rounded-full py-2 pl-2">
          <span className="relative z-10 inline-flex shrink-0 items-center gap-1.5 rounded-full bg-orange-400/15 px-3 py-1.5 text-[11px] font-semibold text-orange-700">
            <Megaphone className="size-3.5" aria-hidden />
            Notices
          </span>
          <Marquee className="min-w-0 flex-1" speed={45}>
            {notices.map((notice) => (
              <span
                className="flex items-center gap-3 pr-10 text-xs text-ink-muted"
                key={notice}
              >
                <span className="size-1.5 rounded-full bg-navy-500/50" />
                {notice}
              </span>
            ))}
          </Marquee>
        </div>
      </section>

      {/* ---------------------------------------------------------- Statement */}
      <section className="mx-auto w-full max-w-5xl px-4 py-24 sm:px-6 sm:py-32">
        <p
          className="text-center text-3xl font-semibold leading-[1.2] tracking-[-0.03em] text-ink sm:text-5xl"
          data-scrub-words
        >
          Short weighing quietly costs households every single day. A stamped
          scale is your right — and now anyone can check it in one scan, before
          they pay.
        </p>
        <Marquee className="mt-14" reverse speed={30}>
          {instrumentsCovered.map((item) => (
            <span
              className="glass mr-3 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-ink"
              key={item}
            >
              <BadgeCheck className="size-4 text-emerald-600" aria-hidden />
              {item}
            </span>
          ))}
        </Marquee>
      </section>

      {/* --------------------------------------------------------- Role picker */}
      <section className="mx-auto w-full max-w-360 px-4 pb-24 sm:px-6">
        <SectionTitle
          body="Three interfaces, one verification record. Pick the one that fits you."
          eyebrow="Get started"
          title="How do you want to use the portal?"
        />

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {roles.map((role) => {
            const Art = role.art;
            return (
              <Link
                className="glass spotlight group flex flex-col overflow-hidden rounded-4xl transition-shadow duration-500 hover:shadow-[0_40px_80px_-30px_rgb(30_41_90/0.35)]"
                data-reveal
                data-tilt="6"
                href={role.href}
                key={role.title}
              >
                <div
                  className={`relative m-2 flex h-48 items-end justify-center overflow-hidden rounded-3xl bg-linear-to-br ${role.tint}`}
                >
                  <Art className="h-44 w-auto transition-transform duration-700 ease-glass group-hover:scale-110" />
                  <span className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/80 text-ink-muted shadow-sm transition-all duration-500 ease-glass group-hover:rotate-45 group-hover:bg-ink group-hover:text-white">
                    <ArrowUpRight className="size-4" aria-hidden />
                  </span>
                </div>
                <div className="flex flex-1 flex-col px-6 pb-6 pt-4">
                  <p className="text-xs font-medium text-ink-muted">I am a</p>
                  <h3 className="text-xl font-semibold text-ink">
                    {role.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-6 text-ink-muted">
                    {role.body}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-ink">
                    {role.cta}
                    <ArrowRight
                      className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                      aria-hidden
                    />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ------------------------------------------------------------ How flow */}
      <section
        className="relative overflow-hidden px-3 sm:px-4"
        data-hscroll
        data-motion-manual
      >
        <div className="aurora-dark mx-auto w-full max-w-360 overflow-hidden rounded-4xl px-5 py-14 text-white sm:px-10 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionTitle
              body="From application to the citizen's phone, every step is recorded once and can't be quietly edited later."
              eyebrow="The process"
              light
              title="How a fraud-proof verification works"
            />
            <div className="hidden w-56 lg:block">
              <p className="mb-2 text-[11px] uppercase tracking-[0.14em] text-white/40">
                Scroll to follow
              </p>
              <div className="h-1 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full origin-left rounded-full bg-linear-to-r from-indigo-400 via-sky-300 to-orange-300"
                  data-hscroll-bar
                />
              </div>
            </div>
          </div>

          <ol
            className="mt-12 grid gap-4 sm:grid-cols-2 lg:flex lg:w-max lg:gap-5"
            data-hscroll-track
          >
            {flow.map((step, index) => {
              const Art = step.art;
              return (
                <li
                  className="glass-dark relative flex flex-col rounded-4xl p-6 lg:w-[26rem] lg:p-8"
                  key={step.title}
                >
                  <div className="flex items-start justify-between">
                    <Art className="size-24 lg:size-28" />
                    <span className="num text-6xl font-semibold tracking-tighter text-white/8 lg:text-8xl">
                      0{index + 1}
                    </span>
                  </div>
                  <h3 className="mt-8 text-xl font-semibold lg:text-2xl">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-white/60 lg:text-[15px] lg:leading-7">
                    {step.body}
                  </p>
                </li>
              );
            })}
            <li className="hidden flex-col justify-center rounded-4xl border border-dashed border-white/15 p-8 lg:flex lg:w-[22rem]">
              <p className="text-2xl font-semibold tracking-tight">
                That&apos;s it. No paper, no desk.
              </p>
              <Link
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-semibold text-navy-900"
                data-magnetic
                href="/verify/LM-UP-PRY-000123"
              >
                <QrCode className="size-4" aria-hidden />
                See a sealed record
              </Link>
            </li>
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- Camps + QR */}
      <section className="mx-auto grid w-full max-w-360 gap-4 px-4 py-24 sm:px-6 lg:grid-cols-[1fr_26rem]">
        <div className="glass flex flex-col rounded-4xl p-2">
          <header className="flex flex-wrap items-center justify-between gap-3 px-4 pb-3 pt-4">
            <div>
              <h2 className="text-xl font-semibold text-ink">
                Mobile verification camps this week
              </h2>
              <p className="text-xs text-ink-muted">
                Street vendors and mandi stalls can get stamped on the spot.
              </p>
            </div>
            <Link
              className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-ink transition-colors hover:bg-white"
              data-magnetic
              href="/camps"
            >
              All camps
              <ArrowRight className="size-3.5" aria-hidden />
            </Link>
          </header>

          <ul className="space-y-1.5">
            {activeCamps.map((camp) => (
              <li
                className="group flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white/50 px-4 py-4 transition-all duration-300 hover:translate-x-1 hover:bg-white/85"
                data-reveal
                key={camp.id}
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-2xl bg-white text-ink/70 shadow-[0_1px_2px_rgb(15_23_42/0.06)] transition-colors group-hover:bg-ink group-hover:text-white">
                    <Truck className="size-4.5" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">
                      {camp.market}
                    </p>
                    <p className="text-xs text-ink-muted">
                      {camp.district} · {camp.day}, {camp.date} · {camp.window}{" "}
                      · Van {camp.van}
                    </p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                    camp.state === "active"
                      ? "bg-emerald-500/12 text-emerald-700"
                      : "bg-slate-500/10 text-ink-muted"
                  }`}
                >
                  {camp.state === "active" ? (
                    <span className="relative flex size-2">
                      <span className="absolute inset-0 animate-ping rounded-full bg-emerald-500/70" />
                      <span className="relative size-2 rounded-full bg-emerald-500" />
                    </span>
                  ) : null}
                  {camp.state === "active" ? "Active now" : "Upcoming"}
                </span>
              </li>
            ))}
          </ul>

          <div className="mt-auto grid grid-cols-3 gap-1.5 pt-1.5">
            {[
              ["3", "vans on route today"],
              ["42", "instruments stamped since 7 AM"],
              ["₹0", "extra fee at a camp"],
            ].map(([value, label]) => (
              <div className="rounded-3xl bg-white/40 px-4 py-4" key={label}>
                <p className="num text-2xl font-semibold text-ink" data-count>
                  {value}
                </p>
                <p className="mt-0.5 text-[11px] leading-4 text-ink-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="aurora-dark relative overflow-hidden rounded-4xl p-6 text-white">
          <div
            aria-hidden
            className="blob absolute -right-20 -top-20 size-64 rounded-full bg-sky-400/25 blur-3xl"
          />
          <div className="relative -mx-2 -mt-2 rounded-3xl bg-white/90 p-2">
            <ConsumerArt className="h-40 w-full" />
          </div>
          <h2 className="relative mt-6 text-2xl font-semibold tracking-tight">
            Standing at a shop right now?
          </h2>
          <p className="relative mt-2 text-sm leading-6 text-white/65">
            Point your camera at the QR sticker on the scale. See the stamping
            date, the verifying officer and the expiry — before you pay.
          </p>
          <Link
            className="relative mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-4 py-3 text-sm font-semibold text-navy-900"
            href="/verify"
          >
            <ScanLine className="size-4" aria-hidden />
            Open live scanner
          </Link>
          <Link
            className="glass-dark relative mt-2 inline-flex w-full items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/15"
            href="/verify/LM-UP-PRY-000123"
          >
            <QrCode className="size-4" aria-hidden />
            See a sample result
          </Link>
        </div>
      </section>

      {/* -------------------------------------------------------------- Rights */}
      <section
        className="mx-auto w-full max-w-360 scroll-mt-24 px-4 sm:px-6"
        id="rights"
      >
        <SectionTitle
          body="What the law guarantees you at the counter."
          eyebrow="Consumer protection"
          title="Know your rights"
        />

        <div className="mt-12 grid gap-4 md:grid-cols-2">
          {rights.map((right, index) => (
            <article
              className="glass spotlight group rounded-4xl p-7"
              data-reveal
              data-tilt="4"
              key={right.heading}
            >
              <span className="num inline-flex size-10 items-center justify-center rounded-2xl bg-navy-500/10 text-sm font-semibold text-navy-500 transition-colors duration-300 group-hover:bg-navy-500 group-hover:text-white">
                §{index + 1}
              </span>
              <h3 className="mt-5 text-lg font-semibold text-ink">
                {right.heading}
              </h3>
              <p className="mt-2 text-sm leading-6 text-ink-muted">
                {right.body}
              </p>
            </article>
          ))}
        </div>

        <div
          className="glass-strong mt-4 flex flex-col gap-4 rounded-4xl p-4 sm:flex-row sm:items-center sm:rounded-full sm:py-3 sm:pl-5 sm:pr-3"
          data-reveal
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-navy-500/10 text-navy-500">
            <CalendarClock className="size-5" aria-hidden />
          </span>
          <p className="flex-1 text-sm text-ink">
            Instrument validity is typically one year. Traders are notified 30
            days before expiry — and the instrument is flagged publicly the day
            after.
          </p>
          <Link
            className="btn-ink inline-flex items-center justify-center gap-1.5 rounded-full px-5 py-2.5 text-sm font-semibold transition-all hover:brightness-125"
            data-magnetic="0.2"
            href="/business/dashboard"
          >
            See a trader dashboard
            <ArrowRight className="size-4" aria-hidden />
          </Link>
        </div>
      </section>
    </>
  );
};

export default HomePage;
