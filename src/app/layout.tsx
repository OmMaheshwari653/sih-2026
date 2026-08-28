import type { Metadata } from "next";
import { Inter, Noto_Sans_Devanagari, Source_Serif_4 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const serifGov = Source_Serif_4({
  variable: "--font-serif-gov",
  subsets: ["latin"],
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
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      className={`${inter.variable} ${serifGov.variable} ${deva.variable} h-full antialiased`}
      lang="en"
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
