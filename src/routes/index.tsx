import { createFileRoute } from "@tanstack/react-router";
import { Link } from "@tanstack/react-router";
import { useApp, todayISO, daysFromToday, brl } from "@/lib/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles, Wallet, Receipt, ListChecks, Heart, Sun, ArrowRight, CheckCircle2, AlertTriangle,
} from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { user, tasks, habits, incomes, expenses, bills, toggleTask } = useApp();
  const today = todayISO();
  const isTdah = user.mode === "tdah";

  const todaysTasks = tasks.filter((t) => t.date === today);
  const pendingTasks = todaysTasks.filter((t) => t.status === "pendente");
  const nextAction = pendingTasks[0];
  const [skip, setSkip] = useState(0);
  const displayedNext = pendingTasks[skip % Math.max(1, pendingTasks.length)] ?? nextAction;

  const weekBills = bills.filter((b) => {
    const d = daysFromToday(b.dueDate);
    return b.status !== "paga" && d >= 0 && d <= 7;
  }).sort((a,b) => a.dueDate.localeCompare(b.dueDate));
  const billsTotal = weekBills.reduce((s, b) => s + b.amount, 0);

  const monthlyIncome = incomes.reduce((s, i) => s + i.amount, 0);
  const monthlyExpense = expenses.reduce((s, e) => s + e.amount, 0)
    + bills.filter(b => b.status === "paga").reduce((s,b)=>s+b.amount,0);
  const pendingBillsTotal = bills.filter(b => b.status !== "paga").reduce((s,b)=>s+b.amount,0);
  const free = monthlyIncome - monthlyExpense - pendingBillsTotal;
  const freeDay = Math.max(0, free / 30);

  const monthStatus =
    free > monthlyIncome * 0.4 ? { label: "tranquilo", tone: "success", text: "Seu mês ainda está sob controle." } :
    free > monthlyIncome * 0.15 ? { label: "atenção", tone: "warning", text: "Seu mês está em atenção. Evite gastos grandes por enquanto." } :
    { label: "apertado", tone: "destructive", text: "Atenção: o mês está apertado. Vamos com calma." };

  const mainHabit = habits.find((h) => !h.completedDates.includes(today)) ?? habits[0];

  return (
    <div className="space-y-6">
      <header className="space-y-1">
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <Sun className="size-4" /> Olá, {user.name}.
        </p>
        <h1 className="text-2xl sm:text-3xl font-semibold">
          {isTdah ? "Hoje, vamos focar em uma coisa por vez." : "Hoje vamos focar no essencial."}
        </h1>
      </header>

      {/* Próxima ação */}
      <Card className="rounded-3xl border-0 p-6 sm:p-8 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
        <div className="flex items-center gap-2 text-primary-foreground/85 text-sm">
          <Sparkles className="size-4" /> Sua próxima ação
        </div>
        {displayedNext ? (
          <>
            <h2 className="mt-2 text-2xl sm:text-3xl font-semibold leading-tight">{displayedNext.title}</h2>
            <p className="mt-2 text-primary-foreground/85 text-sm">
              {isTdah ? "Você não precisa resolver tudo agora. Só essa." : "Comece por aqui — uma coisa de cada vez."}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button
                size="lg"
                onClick={() => toggleTask(displayedNext.id)}
                className="bg-white text-primary hover:bg-white/90 rounded-full"
              >
                <CheckCircle2 className="size-4" /> Marcar como feito
              </Button>
              {pendingTasks.length > 1 && (
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => setSkip((s) => s + 1)}
                  className="text-primary-foreground hover:bg-white/15 rounded-full"
                >
                  Trocar ação
                </Button>
              )}
              {isTdah && (
                <Button asChild size="lg" variant="ghost" className="text-primary-foreground hover:bg-white/15 rounded-full">
                  <Link to="/foco">Me ajuda a começar <ArrowRight className="size-4" /></Link>
                </Button>
              )}
            </div>
          </>
        ) : (
          <>
            <h2 className="mt-2 text-2xl font-semibold">Tudo certo por aqui.</h2>
            <p className="mt-2 text-primary-foreground/85 text-sm">
              Sem próximas ações. Aproveite para respirar.
            </p>
          </>
        )}
      </Card>

      {/* Cards adaptados ao modo */}
      <div className={`grid gap-4 ${isTdah ? "grid-cols-1" : "sm:grid-cols-2"}`}>
        <Card className="rounded-3xl p-5 border-0 shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Wallet className="size-3.5" /> Dinheiro livre hoje</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">{brl(freeDay)}</p>
            </div>
            <Badge variant="secondary" className="rounded-full">estimado</Badge>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            Esse é o valor que você pode usar sem apertar o mês.
          </p>
        </Card>

        <Card className="rounded-3xl p-5 border-0 shadow-[var(--shadow-card)]">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Receipt className="size-3.5" /> Contas da semana</p>
          {weekBills.length === 0 ? (
            <p className="mt-2 text-foreground">Nenhuma conta pendente agora. Boa.</p>
          ) : (
            <>
              <p className="mt-1 text-foreground">
                Você tem <span className="font-semibold">{weekBills.length}</span> {weekBills.length === 1 ? "conta" : "contas"} para pagar esta semana.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Total {brl(billsTotal)} · próxima: {weekBills[0].name}
              </p>
              <Button asChild variant="ghost" size="sm" className="mt-2 px-0 text-primary hover:bg-transparent hover:text-primary-deep">
                <Link to="/dinheiro">Ver contas <ArrowRight className="size-4" /></Link>
              </Button>
            </>
          )}
        </Card>
      </div>

      {!isTdah && (
        <Card className="rounded-3xl p-5 border-0 shadow-[var(--shadow-card)]">
          <p className="text-xs text-muted-foreground flex items-center gap-1.5"><ListChecks className="size-3.5" /> Tarefas de hoje</p>
          {todaysTasks.length === 0 ? (
            <p className="mt-2 text-muted-foreground">Você ainda não tem tarefas para hoje. Quer criar uma pequena?</p>
          ) : (
            <ul className="mt-3 space-y-2">
              {todaysTasks.slice(0, 3).map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-muted/50 px-3 py-2.5">
                  <button
                    aria-label="alternar tarefa"
                    onClick={() => toggleTask(t.id)}
                    className={`size-5 rounded-full border-2 ${t.status === "feita" ? "bg-success border-success" : "border-muted-foreground/40"}`}
                  />
                  <span className={`flex-1 ${t.status === "feita" ? "line-through text-muted-foreground" : ""}`}>{t.title}</span>
                  <Badge variant="secondary" className="rounded-full text-xs capitalize">{t.period}</Badge>
                </li>
              ))}
              {todaysTasks.length > 3 && (
                <p className="text-xs text-muted-foreground pt-1">Você tem mais tarefas, mas vamos por partes.</p>
              )}
            </ul>
          )}
        </Card>
      )}

      <Card className="rounded-3xl p-5 border-0 shadow-[var(--shadow-card)]">
        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><Heart className="size-3.5" /> Hábito de hoje</p>
        {mainHabit ? (
          <div className="mt-2 flex items-center justify-between gap-3">
            <p className="text-foreground">{mainHabit.title}</p>
            <Badge variant={mainHabit.completedDates.includes(today) ? "default" : "secondary"} className="rounded-full">
              {mainHabit.completedDates.includes(today) ? "feito" : "pendente"}
            </Badge>
          </div>
        ) : (
          <p className="mt-2 text-muted-foreground">Escolha um hábito pequeno para acompanhar.</p>
        )}
        <Progress value={Math.min(100, (habits.filter(h=>h.completedDates.includes(today)).length / Math.max(1,habits.length)) * 100)} className="mt-3 h-2" />
      </Card>

      <Card className={`rounded-3xl p-5 border-0 shadow-[var(--shadow-card)] ${
        monthStatus.tone === "success" ? "bg-success/15" :
        monthStatus.tone === "warning" ? "bg-warning/20" : "bg-destructive/15"
      }`}>
        <p className="text-xs text-muted-foreground flex items-center gap-1.5"><AlertTriangle className="size-3.5" /> Como está seu mês</p>
        <p className="mt-1 font-medium capitalize">{monthStatus.label}</p>
        <p className="text-sm text-muted-foreground mt-1">{monthStatus.text}</p>
      </Card>
    </div>
  );
}
