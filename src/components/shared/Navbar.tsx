import {
  Bell,
  ChevronDown,
  Contrast,
  Landmark,
  Scale,
  UserRound,
} from "lucide-react";
import Image from "next/image";

const TopUtilityBar = () => (
  <div className="bg-gov-navy-dark text-white text-[11px] sm:text-xs">
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-2 sm:px-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <Landmark className="size-4 text-gov-saffron" aria-hidden />
        <span className="font-medium">भारत सरकार</span>
        <span className="hidden tracking-wide text-white/80 sm:inline">
          GOVERNMENT OF INDIA
        </span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <a className="hidden hover:underline lg:inline" href="#main-content">
          Skip to Main Content
        </a>
        <span className="hidden text-white/30 lg:inline">|</span>
        <a className="hidden hover:underline lg:inline" href="#screen-reader">
          Screen Reader Access
        </a>
        <span className="hidden text-white/30 lg:inline">|</span>
        <div className="hidden items-center gap-2 sm:flex">
          <button className="hover:text-gov-saffron" type="button">
            A+
          </button>
          <button className="hover:text-gov-saffron" type="button">
            A
          </button>
          <button className="hover:text-gov-saffron" type="button">
            A-
          </button>
        </div>
        <span className="hidden text-white/30 sm:inline">|</span>
        <button
          aria-label="Toggle high contrast"
          className="hover:text-gov-saffron"
          type="button"
        >
          <Contrast className="size-4" aria-hidden />
        </button>
        <span className="text-white/30">|</span>
        <button
          className="flex items-center gap-1 hover:text-gov-saffron"
          type="button"
        >
          English
          <ChevronDown className="size-3.5" aria-hidden />
        </button>
      </div>
    </div>
  </div>
);

const Navbar = () => {
  return (
    <header>
      <TopUtilityBar />

      <div className="relative overflow-hidden border-b border-slate-200 bg-white">
        <div
          aria-hidden
          className="absolute right-0 top-0 hidden h-full w-40 bg-gradient-to-br from-gov-saffron via-white to-gov-green opacity-70 [clip-path:polygon(45%_0,100%_0,100%_100%,0_100%)] xl:block"
        />

        <div className="relative flex flex-wrap items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
          <Image
            alt="Department of Consumer Affairs, Government of India"
            className="h-9 w-auto sm:h-11"
            height={500}
            preload
            src="/ministry.png"
            width={1500}
          />

          <div className="order-last flex w-full items-center gap-3 lg:order-none lg:w-auto lg:gap-4">
            <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-gov-navy sm:size-14">
              <Scale className="size-6 text-white sm:size-8" aria-hidden />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight text-gov-navy sm:text-2xl">
                Legal Metrology
              </h1>
              <p className="text-xs font-medium text-slate-700 sm:text-sm">
                Online Verification System
              </p>
              <p className="hidden text-[11px] text-slate-500 sm:block">
                Ensuring Accuracy, Transparency &amp; Consumer Protection
              </p>
            </div>
          </div>

          <div className="relative flex items-center gap-4 sm:gap-5">
            <button
              aria-label="Notifications"
              className="relative text-gov-navy"
              type="button"
            >
              <Bell className="size-6" aria-hidden />
              <span className="absolute -right-1.5 -top-1.5 flex size-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white">
                5
              </span>
            </button>

            <button className="flex items-center gap-2" type="button">
              <span className="flex size-9 items-center justify-center rounded-full bg-gov-navy text-white">
                <UserRound className="size-5" aria-hidden />
              </span>
              <span className="hidden text-left text-xs leading-4 sm:block">
                <span className="block text-slate-500">Welcome,</span>
                <span className="block font-semibold text-slate-900">
                  Rajesh Kumar
                </span>
              </span>
              <ChevronDown
                className="hidden size-4 text-slate-500 sm:block"
                aria-hidden
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
