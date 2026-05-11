import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Sparkles, Smartphone, Settings as SettingsIcon, Crown, ChevronRight, HelpCircle, Bell,
} from "lucide-react";

export const Route = createFileRoute("/perfil")({
  component: PerfilPage,
  head: () => ({ meta: [{ title: "Perfil — Vida Simples" }] }),
});

function PerfilPage() {
  const { user, devices, setMode } = useApp();
  const isTdah = user.mode === "tdah";

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <div className="size-16 rounded-3xl bg-[image:var(--gradient-primary)] text-primary-foreground flex items-center justify-center text-2xl font-semibold shadow-[var(--shadow-soft)]">
          {user.name.charAt(0)}
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{user.name}</h1>
          <Badge variant="secondary" className="rounded-full mt-1">{isTdah ? "Modo TDAH.Simples" : "Modo Simples"}</Badge>
        </div>
      </header>

      <Card className="rounded-3xl border-0 p-5 shadow-[var(--shadow-card)]">
        <p className="text-sm font-medium">Modo do app</p>
        <p className="text-sm text-muted-foreground mt-1">Escolha o jeito que funciona melhor para você.</p>
        <div className="mt-4 flex items-center justify-between rounded-2xl bg-muted/50 p-3">
          <div>
            <Label htmlFor="tdah-mode" className="font-medium">Modo TDAH.Simples</Label>
            <p className="text-xs text-muted-foreground">Menos cards, foco em uma ação por vez.</p>
          </div>
          <Switch id="tdah-mode" checked={isTdah} onCheckedChange={(v) => setMode(v ? "tdah" : "simple")} />
        </div>
      </Card>

      <Card className="rounded-3xl border-0 p-5 shadow-[var(--shadow-card)] bg-[image:var(--gradient-primary)] text-primary-foreground">
        <div className="flex items-center gap-2"><Crown className="size-4" /><p className="text-sm">Vida Simples Plus</p></div>
        <p className="mt-2 font-medium">Você está em teste grátis.</p>
        <p className="text-sm text-primary-foreground/85">Aproveite todos os recursos por 7 dias.</p>
        <Button asChild className="rounded-full mt-3 bg-white text-primary hover:bg-white/90">
          <Link to="/assinatura">Ver plano</Link>
        </Button>
      </Card>

      <Card className="rounded-3xl border-0 p-5 shadow-[var(--shadow-card)]">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium flex items-center gap-2"><Smartphone className="size-4" /> Dispositivos conectados</p>
            <p className="text-sm text-muted-foreground mt-1">Você pode usar sua conta em até {user.deviceLimit} dispositivos.</p>
          </div>
          <Badge variant="secondary" className="rounded-full">{devices.length}/{user.deviceLimit}</Badge>
        </div>
        <Button asChild variant="outline" className="rounded-full mt-4 w-full">
          <Link to="/dispositivos">Gerenciar dispositivos</Link>
        </Button>
      </Card>

      <Card className="rounded-3xl border-0 p-2 shadow-[var(--shadow-card)] divide-y divide-border/60">
        <Row icon={<Bell className="size-4" />} title="Lembretes" subtitle="Como você quer ser avisado" to="/configuracoes" />
        <Row icon={<SettingsIcon className="size-4" />} title="Configurações" subtitle="Tema, sons e preferências" to="/configuracoes" />
        <Row icon={<Sparkles className="size-4" />} title="Refazer onboarding" subtitle="Reveja a apresentação" to="/onboarding" />
        <Row icon={<HelpCircle className="size-4" />} title="Suporte" subtitle="Fale com a gente" to="/configuracoes" />
      </Card>
    </div>
  );
}

function Row({ icon, title, subtitle, to }: { icon: React.ReactNode; title: string; subtitle: string; to: "/configuracoes" | "/onboarding" }) {
  return (
    <Link to={to} className="flex items-center gap-3 px-3 py-3.5 hover:bg-muted/40 rounded-2xl">
      <div className="size-9 rounded-2xl bg-secondary flex items-center justify-center text-secondary-foreground">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="font-medium">{title}</p>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
      <ChevronRight className="size-4 text-muted-foreground" />
    </Link>
  );
}