import { Link, useLocation } from "@tanstack/react-router";
import { Home, ListChecks, Wallet, Timer, User } from "lucide-react";
import { useApp } from "@/lib/app-store";
import { Badge } from "@/components/ui/badge";
import type { ReactNode } from "react";

const nav = [
  { to: "/", label: "Hoje", icon: Home },
  { to: "/rotina", label: "Rotina", icon: ListChecks },
  { to: "/dinheiro", label: "Dinheiro", icon: Wallet },
  { to: "/foco", label: "Foco", icon: Timer },
  { to: "/perfil", label: "Perfil", icon: User },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const { user } = useApp();
  const loc = useLocation();

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 p-6 gap-6 border-r border-border/60 bg-white/40 backdrop-blur-sm">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-2xl bg-[image:var(--gradient-primary)] shadow-[var(--shadow-soft)]" />
          <div>
            <div className="font-semibold text-foreground">Vida Simples</div>
            <div className="text-xs text-muted-foreground">Sua rotina mais leve</div>
          </div>
        </Link>
        <nav className="flex flex-col gap-1">
          {nav.map((n) => {
            const active = n.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <Link
                key={n.to}
                to={n.to}
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors ${
                  active ? "bg-secondary text-secondary-foreground font-medium" : "hover:bg-muted/60 text-foreground/80"
                }`}
              >
                <Icon className="size-5" />
                <span>{n.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
          <Badge variant="secondary" className="mb-2">
            {user.mode === "tdah" ? "Modo TDAH.Simples" : "Modo Simples"}
          </Badge>
          <p className="text-sm text-muted-foreground">Olá, {user.name}. Vamos com calma.</p>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 min-w-0 pb-24 md:pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 md:py-10">{children}</div>
      </main>

      {/* Bottom nav (mobile) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t border-border/60 bg-white/90 backdrop-blur-md">
        <ul className="grid grid-cols-5">
          {nav.map((n) => {
            const active = n.to === "/" ? loc.pathname === "/" : loc.pathname.startsWith(n.to);
            const Icon = n.icon;
            return (
              <li key={n.to}>
                <Link
                  to={n.to}
                  className={`flex flex-col items-center gap-1 py-3 text-xs ${
                    active ? "text-primary font-medium" : "text-muted-foreground"
                  }`}
                >
                  <Icon className={`size-5 ${active ? "text-primary" : ""}`} />
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}