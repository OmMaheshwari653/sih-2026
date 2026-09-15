import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Instrument_Serif,
  Noto_Sans_Devanagari,
} from "next/font/google";
import { IntroCurtain } from "@/components/motion/IntroCurtain";
import { MotionScope } from "@/components/motion/MotionScope";
import { INTRO_KEY } from "@/lib/motion-keys";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

const display = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

const deva = Noto_Sans_Devanagari({
  variable: "--font-deva",
  subsets: ["devanagari"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Legal Metrology Online Verification System",
    template: "%s | Legal Metrology OVS",
  },
  description:
    "Unified digital verification, stamping and enforcement platform for weighing and measuring instruments under the Legal Metrology Act, 2009 — Department of Consumer Affairs, Government of India.",
  icons: { icon: "/logo.svg" },
};

/*
 * Runs before first paint so motion never flashes content it is about to
 * animate: stages `#main` for its entrance and queues the first-visit intro.
 * Reduced-motion users get neither.
 */
const bootMotion = `(function(){try{var d=document.documentElement;if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;d.classList.add('motion-ready');if(!sessionStorage.getItem('${INTRO_KEY}'))d.classList.add('intro-pending');}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${geist.variable} ${geistMono.variable} ${display.variable} ${deva.variable} h-full antialiased`}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: static boot script, no user input */}
        <script dangerouslySetInnerHTML={{ __html: bootMotion }} />
      </head>
      <body className="min-h-full">
        <IntroCurtain />
        <MotionScope>{children}</MotionScope>
      </body>
    </html>
  );
}
