import { GovStrip, Masthead } from "@/components/shared/Masthead";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="flex min-h-screen flex-col">
      <GovStrip />
      <Masthead />
      <main className="flex-1" id="main">
        {children}
      </main>
      <footer className="px-4 py-5 text-center text-[11px] text-ink-muted sm:px-6">
        Department of Consumer Affairs · Helpline 1800-11-4000 · Smart India
        Hackathon prototype
      </footer>
    </div>
  );
}
