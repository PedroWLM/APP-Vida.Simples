import { createFileRoute } from "@tanstack/react-router";
import { useApp, todayISO, daysFromToday } from "@/lib/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Sparkles, Sun, CloudSun, Moon, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import type { Task } from "@/lib/vida-types";

export const Route = createFileRoute("/rotina")({
  component: RotinaPage,
  head: () => ({ meta: [{ title: "Rotina — Vida Simples" }] }),
});

const periodIcon = { manha: Sun, tarde: CloudSun, noite: Moon } as const;

function RotinaPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-semibold">Sua rotina</h1>
        <p className="text-muted-foreground text-sm mt-1">Organize tarefas, hábitos e a semana — sem pressa.</p>
      </header>

      <Tabs defaultValue="tarefas" className="space-y-5">
        <TabsList className="rounded-full bg-muted/60 p-1">
          <TabsTrigger value="tarefas" className="rounded-full">Tarefas</TabsTrigger>
          <TabsTrigger value="habitos" className="rounded-full">Hábitos</TabsTrigger>
          <TabsTrigger value="semana" className="rounded-full">Semana</TabsTrigger>
        </TabsList>

        <TabsContent value="tarefas"><TasksSection /></TabsContent>
        <TabsContent value="habitos"><HabitsSection /></TabsContent>
        <TabsContent value="semana"><WeekSection /></TabsContent>
      </Tabs>
    </div>
  );
}

function TasksSection() {
  const { tasks, toggleTask, addTask } = useApp();
  const today = todayISO();
  const todays = tasks.filter((t) => t.date === today);
  const groups: Array<["manha"|"tarde"|"noite", string]> = [
    ["manha","Manhã"],["tarde","Tarde"],["noite","Noite"],
  ];

  return (
    <div className="space-y-5">
      <div className="flex justify-end">
        <NewTaskDialog onCreate={addTask} />
      </div>
      {todays.length === 0 && (
        <Card className="rounded-3xl border-0 p-6 shadow-[var(--shadow-card)]">
          <p className="text-muted-foreground">Você ainda não tem tarefas para hoje. Quer criar uma pequena?</p>
        </Card>
      )}
      {groups.map(([key, label]) => {
        const list = todays.filter((t) => t.period === key);
        if (list.length === 0) return null;
        const Icon = periodIcon[key];
        return (
          <section key={key} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Icon className="size-4" /> {label}
            </h3>
            <div className="space-y-2">
              {list.map((t) => <TaskRow key={t.id} task={t} onToggle={() => toggleTask(t.id)} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}

function TaskRow({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const [open, setOpen] = useState(false);
  const priorityColor = { alta: "bg-destructive", media: "bg-warning", baixa: "bg-success" }[task.priority];
  return (
    <Card className="rounded-2xl border-0 shadow-[var(--shadow-card)] p-4 flex items-center gap-3">
      <button
        onClick={onToggle}
        aria-label="concluir"
        className={`size-6 shrink-0 rounded-full border-2 flex items-center justify-center ${
          task.status === "feita" ? "bg-success border-success text-white" : "border-muted-foreground/40"
        }`}
      >
        {task.status === "feita" && <CheckCircle2 className="size-4" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className={`truncate ${task.status === "feita" ? "line-through text-muted-foreground" : ""}`}>{task.title}</p>
        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
          <span className={`size-2 rounded-full ${priorityColor}`} />
          <span className="capitalize">prioridade {task.priority}</span>
        </div>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" variant="ghost" className="rounded-full text-primary">
            <Sparkles className="size-4" /> Dividir
          </Button>
        </DialogTrigger>
        <DialogContent className="rounded-3xl">
          <DialogHeader><DialogTitle>Vamos dividir em passos pequenos</DialogTitle></DialogHeader>
          <p className="text-sm text-muted-foreground">Essa tarefa parece grande. Comece pelo menor passo possível.</p>
          <ol className="space-y-2 mt-2">
            {(task.steps?.length ? task.steps : [
              "Abrir o que precisa para começar",
              "Olhar por 1 minuto",
              "Fazer só o primeiro pedacinho",
              "Marcar como iniciado",
            ]).map((s, i) => (
              <li key={i} className="flex gap-3 rounded-2xl bg-muted/60 p-3">
                <span className="size-6 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">{i+1}</span>
                <span className="text-sm">{s}</span>
              </li>
            ))}
          </ol>
          <DialogFooter><Button onClick={() => setOpen(false)} className="rounded-full">Vou tentar</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function NewTaskDialog({ onCreate }: { onCreate: (t: Omit<Task,"id"|"status">) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [period, setPeriod] = useState<"manha"|"tarde"|"noite">("manha");
  const [priority, setPriority] = useState<"baixa"|"media"|"alta">("media");
  const submit = () => {
    if (!title.trim()) return;
    onCreate({ title, date: todayISO(), period, priority });
    setTitle(""); setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="rounded-full"><Plus className="size-4" /> Nova tarefa</Button></DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader><DialogTitle>Nova tarefa</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Nome</Label><Input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="O que você quer fazer?" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Período</Label>
              <Select value={period} onValueChange={(v)=>setPeriod(v as never)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="manha">Manhã</SelectItem>
                  <SelectItem value="tarde">Tarde</SelectItem>
                  <SelectItem value="noite">Noite</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5"><Label>Prioridade</Label>
              <Select value={priority} onValueChange={(v)=>setPriority(v as never)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="alta">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <DialogFooter><Button onClick={submit} className="rounded-full">Criar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function HabitsSection() {
  const { habits, toggleHabit, addHabit } = useApp();
  const today = todayISO();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");

  const create = () => {
    if (!name.trim()) return;
    addHabit({ title: name, frequency: "diario", period: "manha" });
    setName(""); setOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full"><Plus className="size-4" /> Novo hábito</Button></DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader><DialogTitle>Novo hábito</DialogTitle></DialogHeader>
            <div className="space-y-1.5"><Label>Hábito</Label><Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Ex.: Beber água" /></div>
            <DialogFooter><Button onClick={create} className="rounded-full">Criar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {habits.length === 0 ? (
        <Card className="rounded-3xl border-0 p-6 shadow-[var(--shadow-card)]">
          <p className="text-muted-foreground">Escolha um hábito pequeno para acompanhar.</p>
        </Card>
      ) : (
        <div className="space-y-2">
          {habits.map((h) => {
            const done = h.completedDates.includes(today);
            return (
              <Card key={h.id} className="rounded-2xl border-0 shadow-[var(--shadow-card)] p-4 flex items-center gap-3">
                <button onClick={() => toggleHabit(h.id)}
                  className={`size-6 rounded-full border-2 flex items-center justify-center ${done ? "bg-success border-success text-white" : "border-muted-foreground/40"}`}>
                  {done && <CheckCircle2 className="size-4" />}
                </button>
                <div className="flex-1">
                  <p className={done ? "line-through text-muted-foreground" : ""}>{h.title}</p>
                  <p className="text-xs text-muted-foreground capitalize">{h.frequency} · {h.period}</p>
                </div>
                <Badge variant="secondary" className="rounded-full">{h.completedDates.length}× feito</Badge>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function WeekSection() {
  const { tasks, habits, bills } = useApp();
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() + i);
    return d.toISOString().slice(0,10);
  });
  const fmt = (iso: string) => new Date(iso).toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "short" });
  return (
    <div className="space-y-3">
      {days.map((iso) => {
        const dayTasks = tasks.filter((t) => t.date === iso);
        const dayBills = bills.filter((b) => b.dueDate === iso && b.status !== "paga");
        const isToday = daysFromToday(iso) === 0;
        return (
          <Card key={iso} className={`rounded-2xl border-0 shadow-[var(--shadow-card)] p-4 ${isToday ? "bg-secondary" : ""}`}>
            <div className="flex items-center justify-between">
              <p className="font-medium capitalize">{fmt(iso)}{isToday && " · hoje"}</p>
              <Badge variant="secondary" className="rounded-full">{dayTasks.length + dayBills.length} item{dayTasks.length+dayBills.length !== 1 ? "s" : ""}</Badge>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              {dayTasks.map((t) => <p key={t.id} className="text-foreground/80">• {t.title}</p>)}
              {dayBills.map((b) => <p key={b.id} className="text-destructive">• Conta: {b.name}</p>)}
              {isToday && habits.map((h) => <p key={h.id} className="text-muted-foreground">• Hábito: {h.title}</p>)}
              {dayTasks.length + dayBills.length === 0 && !isToday && (
                <p className="text-muted-foreground">Dia tranquilo.</p>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}