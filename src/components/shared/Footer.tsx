const links = [
  "About Us",
  "Privacy Policy",
  "Terms & Conditions",
  "Contact Us",
];

const Footer = () => {
  return (
    <footer className="bg-gov-navy-dark px-6 py-3 text-white">
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <p className="text-white/80">
          © 2025 Department of Consumer Affairs. All Rights Reserved.
        </p>
        <nav className="flex items-center gap-3">
          {links.map((link, index) => (
            <span className="flex items-center gap-3" key={link}>
              <a
                className="text-white/85 hover:text-gov-saffron"
                href="#footer"
              >
                {link}
              </a>
              {index < links.length - 1 ? (
                <span className="text-white/30">|</span>
              ) : null}
            </span>
          ))}
        </nav>
      </div>
    </footer>
  );
};

export default Footer;
