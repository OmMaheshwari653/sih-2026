import Image from "next/image";
import Link from "next/link";
import { LogoMark } from "@/components/brand/Logo";

const columns = [
  {
    title: "Citizen Services",
    links: [
      { label: "Scan & Verify a Scale", href: "/verify" },
      { label: "Report Under-weighing", href: "/report-fraud" },
      { label: "Mobile Verification Camps", href: "/camps" },
      { label: "Know Your Rights", href: "/#rights" },
    ],
  },
  {
    title: "For Business",
    links: [
      { label: "Trader Login", href: "/auth/business/login" },
      {
        label: "Register an Instrument",
        href: "/business/instruments/register",
      },
      { label: "Book Verification Slot", href: "/business/requests/new" },
      { label: "Digital Certificate Vault", href: "/business/certificates" },
    ],
  },
  {
    title: "Department",
    links: [
      { label: "Officer Login", href: "/auth/lmo/login" },
      { label: "State Command Centre", href: "/admin/dashboard" },
      { label: "E-Challan Feed", href: "/admin/challans" },
    ],
  },
  {
    title: "Legal & Policy",
    links: [
      { label: "Legal Metrology Act, 2009", href: "/#rights" },
      { label: "Legal Metrology (General) Rules, 2011", href: "/#rights" },
      { label: "Verification Fee Schedule", href: "/#rights" },
      { label: "Terms & Privacy Policy", href: "/#rights" },
    ],
  },
];

const Footer = () => (
  <footer className="mt-auto px-3 pb-3 pt-12 sm:px-4" id="footer">
    <div className="aurora-dark relative mx-auto w-full max-w-360 overflow-hidden rounded-4xl text-white">
      <div
        aria-hidden
        className="blob pointer-events-none absolute -right-40 -top-40 size-120 rounded-full bg-indigo-500/25 blur-3xl"
      />
      <div className="relative grid gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.1fr_2fr]">
        <div>
          <div className="flex items-center gap-3">
            <LogoMark className="size-11" />
            <p className="text-lg font-semibold leading-tight tracking-tight">
              Legal Metrology
              <span className="block text-sm font-normal text-white/55">
                Online Verification System
              </span>
            </p>
          </div>
          <p className="mt-4 max-w-xs text-[13px] leading-5 text-white/60">
            One verification record shared by traders, officers and citizens —
            from stamping to the shop counter.
          </p>
          <a
            className="glass-dark mt-5 inline-flex rounded-full px-3.5 py-1.5 text-xs transition-colors hover:bg-white/15"
            data-magnetic
            href="tel:18001140000"
          >
            Helpline{" "}
            <span className="num ml-1.5 font-semibold">1800-11-4000</span>
          </a>
          <div className="mt-6 w-fit rounded-2xl bg-white px-3 py-2">
            <Image
              alt="Department of Consumer Affairs, Government of India"
              className="h-9 w-auto"
              height={279}
              src="/ministry.png"
              width={830}
            />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((column) => (
            <nav key={column.title}>
              <h3 className="mb-3 text-[11px] font-medium uppercase tracking-[0.12em] text-white/45">
                {column.title}
              </h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      className="text-[13px] text-white/75 transition-colors hover:text-white"
                      href={link.href}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <p
        aria-hidden
        className="relative select-none px-4 text-center text-[15vw] font-semibold leading-[0.85] tracking-[-0.06em] text-white/[0.07] xl:text-[12rem]"
        data-split="lines"
      >
        Verified.
      </p>

      <div className="relative flex flex-col gap-2 border-t border-white/10 px-6 py-5 text-[11px] text-white/50 sm:px-10 lg:flex-row lg:items-center lg:justify-between">
        <p>
          © 2025 Department of Consumer Affairs, Government of India · Hosted by
          NIC · Smart India Hackathon prototype
        </p>
        <p className="flex items-center gap-2">
          <span className="tricolor-rule h-1 w-8 rounded-full" aria-hidden />
          Last updated 20 May 2025 · v2.4.1
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
