import Link from "next/link";

const columns = [
  {
    title: "Citizen Services",
    links: [
      { label: "Verify a Scale by QR", href: "/verify/LM-UP-PRY-000123" },
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
      { label: "Mandi Gatekeeper Scan", href: "/gatekeeper/scan" },
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
  <footer className="mt-auto bg-navy-900 text-white" id="footer">
    <div className="mx-auto w-full max-w-360 px-4 py-8 sm:px-6">
      <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {columns.map((column) => (
          <nav key={column.title}>
            <h3 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-saffron">
              {column.title}
            </h3>
            <ul className="space-y-2">
              {column.links.map((link) => (
                <li key={link.label}>
                  <Link
                    className="text-xs text-white/75 hover:text-white hover:underline"
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

      <div className="mt-8 grid gap-4 border-t border-white/15 pt-5 text-[11px] text-white/60 lg:grid-cols-[1fr_auto]">
        <p>
          Content owned and maintained by the Department of Consumer Affairs,
          Ministry of Consumer Affairs, Food &amp; Public Distribution,
          Government of India. Site designed and hosted by the National
          Informatics Centre.
        </p>
        <p className="lg:text-right">
          Helpline 1800-11-4000 · Last updated 20 May 2025 · Version 2.4.1
        </p>
      </div>
    </div>

    <div className="border-t border-white/10 bg-black/25">
      <p className="mx-auto w-full max-w-360 px-4 py-3 text-[11px] text-white/55 sm:px-6">
        © 2025 Department of Consumer Affairs. All rights reserved. This is a
        Smart India Hackathon prototype interface.
      </p>
    </div>
  </footer>
);

export default Footer;
