import { GovStrip, Masthead } from "@/components/shared/Masthead";

export default function AuthLayout({ children }: LayoutProps<"/auth">) {
  return (
    <div className="flex min-h-screen flex-col">
      <GovStrip />
      <Masthead />
      <main className="flex-1" id="main">
        {children}
      </main>
      <footer className="border-t border-line bg-surface px-4 py-3 text-center text-[11px] text-ink-muted sm:px-6">
        Department of Consumer Affairs · Helpline 1800-11-4000 · This is a
        prototype interface built for Smart India Hackathon.
      </footer>
    </div>
  );
}
