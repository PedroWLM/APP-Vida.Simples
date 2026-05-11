import { createFileRoute, Link } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Monitor, Tablet, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/dispositivos")({
  component: Dispositivos,
  head: () => ({ meta: [{ title: "Dispositivos — Vida Simples" }] }),
});

const iconFor = { celular: Smartphone, computador: Monitor, tablet: Tablet };

function Dispositivos() {
  const { devices, user, removeDevice } = useApp();
  const atLimit = devices.length >= user.deviceLimit;
  return (
    <div className="space-y-6">
      <Link to="/perfil" className="text-sm text-muted-foreground inline-flex items-center gap-1 hover:text-foreground"><ArrowLeft className="size-4" /> Perfil</Link>
      <header>
        <h1 className="text-2xl font-semibold">Dispositivos conectados</h1>
        <p className="text-muted-foreground text-sm mt-1">Você pode usar sua conta em até {user.deviceLimit} dispositivos.</p>
      </header>
      {atLimit && (
        <Card className="rounded-3xl border-0 p-4 bg-warning/20">
          <p className="text-sm">Você atingiu o limite de dispositivos conectados. Remova um dispositivo para entrar em outro.</p>
        </Card>
      )}
      <div className="space-y-2">
        {devices.map((d) => {
          const Icon = iconFor[d.deviceType];
          return (
            <Card key={d.id} className="rounded-2xl border-0 shadow-[var(--shadow-card)] p-4 flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-secondary flex items-center justify-center"><Icon className="size-5" /></div>
              <div className="flex-1 min-w-0">
                <p className="font-medium">{d.deviceName}</p>
                <p className="text-xs text-muted-foreground">Último acesso {new Date(d.lastAccess).toLocaleDateString("pt-BR")}</p>
              </div>
              {d.active && <Badge variant="secondary" className="rounded-full">ativo</Badge>}
              <Button size="sm" variant="ghost" className="text-destructive rounded-full" onClick={() => removeDevice(d.id)}>Remover</Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}