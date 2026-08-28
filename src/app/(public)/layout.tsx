import Footer from "@/components/shared/Footer";
import { PublicHeader } from "@/components/shared/PublicHeader";

export default function PublicLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicHeader />
      <main className="flex-1" id="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}
