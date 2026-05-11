import { createFileRoute } from "@tanstack/react-router";
import { useApp } from "@/lib/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Pause, Play, RotateCcw, Sparkles } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const Route = createFileRoute("/foco")({
  component: FocoPage,
  head: () => ({ meta: [{ title: "Foco — Vida Simples" }] }),
});

function FocoPage() {
  const { user } = useApp();
  const [mission, setMission] = useState("");
  const [duration, setDuration] = useState(25);
  const [remaining, setRemaining] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const ref = useRef<number | null>(null);

  useEffect(() => {
    if (running) {
      ref.current = window.setInterval(() => {
        setRemaining((r) => {
          if (r <= 1) { setRunning(false); setDone(true); return 0; }
          return r - 1;
        });
      }, 1000);
    }
    return () => { if (ref.current) clearInterval(ref.current); };
  }, [running]);

  const start = () => { setRemaining(duration * 60); setRunning(true); setDone(false); };
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const inSession = remaining > 0 || running;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-semibold">Vamos focar em uma coisa.</h1>
        <p className="text-muted-foreground text-sm mt-1">Sem pressa. Sem culpa. Só um bloco curto.</p>
      </header>

      {!inSession && !done && (
        <Card className="rounded-3xl border-0 p-6 shadow-[var(--shadow-card)] space-y-5">
          <div className="space-y-1.5">
            <Label>Qual é sua missão agora?</Label>
            <Input value={mission} onChange={(e)=>setMission(e.target.value)} placeholder="Ex.: Estudar matemática" />
          </div>
          <div className="space-y-2">
            <Label>Tempo</Label>
            <div className="flex flex-wrap gap-2">
              {[10,15,25].map((d) => (
                <Button key={d} variant={duration === d ? "default" : "outline"} className="rounded-full" onClick={() => setDuration(d)}>
                  {d} minutos
                </Button>
              ))}
            </div>
          </div>
          <Button size="lg" className="rounded-full w-full" onClick={start} disabled={!mission.trim()}>
            <Play className="size-4" /> Começar foco
          </Button>
          {user.mode === "tdah" && <NaoSeiPorOndeComecar onSuggest={(s) => setMission(s)} />}
        </Card>
      )}

      {inSession && (
        <Card className="rounded-3xl border-0 p-8 sm:p-12 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)] text-center space-y-4">
          <p className="text-primary-foreground/85 text-sm">Sua missão</p>
          <p className="text-xl font-medium">{mission}</p>
          <p className="text-7xl sm:text-8xl font-semibold tabular-nums tracking-tight">{mm}:{ss}</p>
          <div className="flex justify-center gap-2 pt-2">
            <Button size="lg" className="rounded-full bg-white text-primary hover:bg-white/90" onClick={() => setRunning((r) => !r)}>
              {running ? <><Pause className="size-4" /> Pausar</> : <><Play className="size-4" /> Continuar</>}
            </Button>
            <Button size="lg" variant="ghost" className="rounded-full text-primary-foreground hover:bg-white/15"
              onClick={() => { setRunning(false); setRemaining(0); setDone(true); }}>
              <RotateCcw className="size-4" /> Finalizar
            </Button>
          </div>
        </Card>
      )}

      {done && (
        <Card className="rounded-3xl border-0 p-8 shadow-[var(--shadow-card)] text-center space-y-3">
          <p className="text-2xl font-semibold">Boa. Você começou, e isso já conta.</p>
          <p className="text-muted-foreground">Volte quando quiser fazer mais um bloquinho.</p>
          <Button className="rounded-full" onClick={() => { setDone(false); setMission(""); }}>Novo foco</Button>
        </Card>
      )}
    </div>
  );
}

function NaoSeiPorOndeComecar({ onSuggest }: { onSuggest: (s: string) => void }) {
  const [open, setOpen] = useState(false);
  const [trying, setTrying] = useState(""); const [block, setBlock] = useState(""); const [step, setStep] = useState("");
  const [suggest, setSuggest] = useState<string | null>(null);
  const generate = () => {
    const s = step.trim() || `Abrir o que você precisa para ${trying || "começar"}. Só isso.`;
    setSuggest(s);
  };
  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setSuggest(null); }}>
      <DialogTrigger asChild>
        <Button variant="outline" className="rounded-full w-full"><Sparkles className="size-4" /> Não sei por onde começar</Button>
      </DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader><DialogTitle>Vamos achar um primeiro passo</DialogTitle></DialogHeader>
        {!suggest ? (
          <div className="space-y-3">
            <div className="space-y-1.5"><Label>O que você está tentando fazer?</Label><Input value={trying} onChange={(e)=>setTrying(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>O que está te travando?</Label><Textarea rows={2} value={block} onChange={(e)=>setBlock(e.target.value)} /></div>
            <div className="space-y-1.5"><Label>Qual seria o menor primeiro passo?</Label><Input value={step} onChange={(e)=>setStep(e.target.value)} placeholder="Ex.: abrir o caderno" /></div>
          </div>
        ) : (
          <div className="rounded-2xl bg-secondary p-4">
            <p className="text-sm text-muted-foreground">Seu primeiro passo é</p>
            <p className="font-medium mt-1">{suggest}</p>
          </div>
        )}
        <DialogFooter>
          {!suggest ? (
            <Button onClick={generate} className="rounded-full">Sugerir passo</Button>
          ) : (
            <Button onClick={() => { onSuggest(suggest); setOpen(false); }} className="rounded-full">Usar como missão</Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}