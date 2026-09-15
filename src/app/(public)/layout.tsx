import Footer from "@/components/shared/Footer";
import { PublicHeader } from "@/components/shared/PublicHeader";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <span
        aria-hidden
        className="fixed inset-x-0 top-0 z-50 h-0.5 origin-left scale-x-0 bg-linear-to-r from-indigo-500 via-sky-400 to-orange-400"
        data-scroll-progress
      />
      <PublicHeader />
      <main className="flex-1" id="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
