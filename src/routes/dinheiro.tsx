import { createFileRoute } from "@tanstack/react-router";
import { useApp, brl, todayISO, daysFromToday } from "@/lib/app-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Plus, Zap } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/dinheiro")({
  component: DinheiroPage,
  head: () => ({ meta: [{ title: "Dinheiro — Vida Simples" }] }),
});

function DinheiroPage() {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-semibold">Seu dinheiro</h1>
        <p className="text-muted-foreground text-sm mt-1">Sem planilha. Só o essencial.</p>
      </header>

      <Tabs defaultValue="resumo" className="space-y-5">
        <TabsList className="rounded-full bg-muted/60 p-1 flex flex-wrap h-auto">
          <TabsTrigger value="resumo" className="rounded-full">Resumo</TabsTrigger>
          <TabsTrigger value="contas" className="rounded-full">Contas</TabsTrigger>
          <TabsTrigger value="gastos" className="rounded-full">Gastos</TabsTrigger>
          <TabsTrigger value="entradas" className="rounded-full">Entradas</TabsTrigger>
          <TabsTrigger value="dividas" className="rounded-full">Dívidas</TabsTrigger>
          <TabsTrigger value="metas" className="rounded-full">Metas</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo"><ResumoSection /></TabsContent>
        <TabsContent value="contas"><ContasSection /></TabsContent>
        <TabsContent value="gastos"><GastosSection /></TabsContent>
        <TabsContent value="entradas"><EntradasSection /></TabsContent>
        <TabsContent value="dividas"><DividasSection /></TabsContent>
        <TabsContent value="metas"><MetasSection /></TabsContent>
      </Tabs>
    </div>
  );
}

function ResumoSection() {
  const { incomes, expenses, bills, debts, goals } = useApp();
  const inc = incomes.reduce((s,i)=>s+i.amount,0);
  const exp = expenses.reduce((s,e)=>s+e.amount,0);
  const pendBills = bills.filter(b=>b.status!=="paga").reduce((s,b)=>s+b.amount,0);
  const free = inc - exp - pendBills;
  const items = [
    { label: "Saldo disponível", value: brl(free), tone: "primary" },
    { label: "Entradas do mês", value: brl(inc) },
    { label: "Gastos do mês", value: brl(exp) },
    { label: "Contas pendentes", value: brl(pendBills) },
    { label: "Dívidas", value: brl(debts.reduce((s,d)=>s+d.remainingAmount,0)) },
    { label: "Metas", value: `${goals.length} ativa${goals.length!==1?"s":""}` },
  ];
  return (
    <div className="space-y-4">
      <Card className="rounded-3xl p-6 border-0 bg-[image:var(--gradient-primary)] text-primary-foreground shadow-[var(--shadow-soft)]">
        <p className="text-sm text-primary-foreground/85">Seu dinheiro livre estimado</p>
        <p className="mt-1 text-4xl font-semibold">{brl(Math.max(0, free))}</p>
        <p className="mt-2 text-sm text-primary-foreground/85">Esse valor considera entradas, gastos e contas pendentes do mês.</p>
      </Card>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {items.map((it) => (
          <Card key={it.label} className="rounded-2xl border-0 shadow-[var(--shadow-card)] p-4">
            <p className="text-xs text-muted-foreground">{it.label}</p>
            <p className={`mt-1 text-lg font-semibold ${it.tone === "primary" ? "text-primary" : ""}`}>{it.value}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function ContasSection() {
  const { bills, payBill, addBill } = useApp();
  const groups = [
    { key: "hoje", label: "Vence hoje", filter: (b: typeof bills[0]) => b.status !== "paga" && daysFromToday(b.dueDate) === 0 },
    { key: "semana", label: "Vence esta semana", filter: (b: typeof bills[0]) => b.status !== "paga" && daysFromToday(b.dueDate) > 0 && daysFromToday(b.dueDate) <= 7 },
    { key: "atrasadas", label: "Atrasadas", filter: (b: typeof bills[0]) => b.status !== "paga" && daysFromToday(b.dueDate) < 0 },
    { key: "pendentes", label: "Pendentes (mais tarde)", filter: (b: typeof bills[0]) => b.status !== "paga" && daysFromToday(b.dueDate) > 7 },
    { key: "pagas", label: "Pagas", filter: (b: typeof bills[0]) => b.status === "paga" },
  ];
  return (
    <div className="space-y-4">
      <div className="flex justify-end"><NewBillDialog onCreate={addBill} /></div>
      {groups.map((g) => {
        const list = bills.filter(g.filter);
        if (list.length === 0) return null;
        return (
          <section key={g.key} className="space-y-2">
            <h3 className="text-sm font-medium text-muted-foreground">{g.label}</h3>
            {list.map((b) => (
              <Card key={b.id} className="rounded-2xl border-0 shadow-[var(--shadow-card)] p-4 flex items-center gap-3">
                <div className="flex-1">
                  <p className="font-medium">{b.name}</p>
                  <p className="text-xs text-muted-foreground">Vence em {new Date(b.dueDate).toLocaleDateString("pt-BR")}</p>
                </div>
                <p className="font-semibold">{brl(b.amount)}</p>
                {b.status !== "paga" ? (
                  <Button size="sm" className="rounded-full" onClick={() => payBill(b.id)}>Marcar paga</Button>
                ) : (
                  <Badge className="rounded-full bg-success text-success-foreground">paga</Badge>
                )}
              </Card>
            ))}
          </section>
        );
      })}
      {bills.length === 0 && <Card className="rounded-3xl border-0 p-6"><p className="text-muted-foreground">Nenhuma conta pendente agora. Boa.</p></Card>}
    </div>
  );
}

function NewBillDialog({ onCreate }: { onCreate: (b: { name: string; amount: number; dueDate: string; recurring: boolean }) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [amount, setAmount] = useState(""); const [date, setDate] = useState(todayISO());
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button className="rounded-full"><Plus className="size-4" /> Nova conta</Button></DialogTrigger>
      <DialogContent className="rounded-3xl">
        <DialogHeader><DialogTitle>Nova conta</DialogTitle></DialogHeader>
        <div className="space-y-3">
          <div className="space-y-1.5"><Label>Nome</Label><Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Internet" /></div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5"><Label>Valor</Label><Input inputMode="decimal" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="99,90" /></div>
            <div className="space-y-1.5"><Label>Vencimento</Label><Input type="date" value={date} onChange={(e)=>setDate(e.target.value)} /></div>
          </div>
        </div>
        <DialogFooter><Button className="rounded-full" onClick={() => {
          if (!name || !amount) return;
          onCreate({ name, amount: Number(amount.replace(",", ".")), dueDate: date, recurring: false });
          setName(""); setAmount(""); setOpen(false);
        }}>Criar</Button></DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const CATEGORIES = ["alimentação","transporte","moradia","saúde","lazer","compras","educação","assinaturas","outros"];

function GastosSection() {
  const { expenses, addExpense } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [amount, setAmount] = useState(""); const [cat, setCat] = useState("alimentação");
  const create = () => {
    if (!name || !amount) return;
    addExpense({ name, amount: Number(amount.replace(",", ".")), category: cat, date: todayISO() });
    setName(""); setAmount(""); setOpen(false);
  };
  return (
    <div className="space-y-4">
      <div className="flex gap-2 justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full"><Zap className="size-4" /> Gastei agora</Button></DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader><DialogTitle>Anotar gasto</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>O que foi?</Label><Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Almoço" /></div>
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5"><Label>Valor</Label><Input inputMode="decimal" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="32,00" /></div>
                <div className="space-y-1.5"><Label>Categoria</Label>
                  <Select value={cat} onValueChange={setCat}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter><Button className="rounded-full" onClick={create}>Anotar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {expenses.length === 0 ? (
        <Card className="rounded-3xl border-0 p-6"><p className="text-muted-foreground">Nenhum gasto registrado hoje.</p></Card>
      ) : (
        <div className="space-y-2">
          {expenses.slice().reverse().map((e) => (
            <Card key={e.id} className="rounded-2xl border-0 shadow-[var(--shadow-card)] p-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="font-medium">{e.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{e.category} · {new Date(e.date).toLocaleDateString("pt-BR")}</p>
              </div>
              <p className="font-semibold">- {brl(e.amount)}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function EntradasSection() {
  const { incomes, addIncome } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [amount, setAmount] = useState("");
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full"><Plus className="size-4" /> Nova entrada</Button></DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader><DialogTitle>Nova entrada</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Nome</Label><Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Salário" /></div>
              <div className="space-y-1.5"><Label>Valor</Label><Input inputMode="decimal" value={amount} onChange={(e)=>setAmount(e.target.value)} placeholder="1500" /></div>
            </div>
            <DialogFooter><Button className="rounded-full" onClick={() => {
              if (!name || !amount) return;
              addIncome({ name, amount: Number(amount.replace(",",".")), date: todayISO(), recurring: false });
              setName(""); setAmount(""); setOpen(false);
            }}>Adicionar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-2">
        {incomes.map((i) => (
          <Card key={i.id} className="rounded-2xl border-0 shadow-[var(--shadow-card)] p-4 flex items-center gap-3">
            <div className="flex-1"><p className="font-medium">{i.name}</p><p className="text-xs text-muted-foreground">{i.recurring ? "recorrente" : "único"}</p></div>
            <p className="font-semibold text-success">+ {brl(i.amount)}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}

function DividasSection() {
  const { debts } = useApp();
  if (debts.length === 0) return <Card className="rounded-3xl border-0 p-6"><p className="text-muted-foreground">Sem dívidas registradas.</p></Card>;
  return (
    <div className="space-y-3">
      {debts.map((d) => {
        const paid = d.totalAmount - d.remainingAmount;
        const pct = (paid / d.totalAmount) * 100;
        return (
          <Card key={d.id} className="rounded-2xl border-0 shadow-[var(--shadow-card)] p-4">
            <div className="flex items-center justify-between">
              <p className="font-medium">{d.name}</p>
              <Badge className="rounded-full capitalize" variant={d.priority === "alta" ? "destructive" : "secondary"}>prioridade {d.priority}</Badge>
            </div>
            <p className="text-sm text-muted-foreground mt-1">{brl(paid)} pagos de {brl(d.totalAmount)}</p>
            <Progress value={pct} className="mt-2 h-2" />
            <p className="text-xs text-muted-foreground mt-2">{d.installments}x de {brl(d.installmentAmount)}</p>
          </Card>
        );
      })}
    </div>
  );
}

function MetasSection() {
  const { goals, addGoal, contributeGoal } = useApp();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(""); const [target, setTarget] = useState("");
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild><Button className="rounded-full"><Plus className="size-4" /> Nova meta</Button></DialogTrigger>
          <DialogContent className="rounded-3xl">
            <DialogHeader><DialogTitle>Nova meta</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5"><Label>Nome</Label><Input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Reserva de emergência" /></div>
              <div className="space-y-1.5"><Label>Quanto quer juntar?</Label><Input inputMode="decimal" value={target} onChange={(e)=>setTarget(e.target.value)} placeholder="500" /></div>
            </div>
            <DialogFooter><Button className="rounded-full" onClick={() => {
              if (!name || !target) return;
              addGoal({ name, type: "reserva", targetAmount: Number(target.replace(",",".")) });
              setName(""); setTarget(""); setOpen(false);
            }}>Criar</Button></DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      {goals.length === 0 ? (
        <Card className="rounded-3xl border-0 p-6"><p className="text-muted-foreground">Crie uma meta simples para começar.</p></Card>
      ) : goals.map((g) => {
        const pct = (g.currentAmount / g.targetAmount) * 100;
        return (
          <Card key={g.id} className="rounded-2xl border-0 shadow-[var(--shadow-card)] p-4">
            <div className="flex items-center justify-between"><p className="font-medium">{g.name}</p><Badge variant="secondary" className="rounded-full capitalize">{g.type}</Badge></div>
            <p className="text-sm text-muted-foreground mt-1">Você juntou {brl(g.currentAmount)} de {brl(g.targetAmount)}.</p>
            <Progress value={pct} className="mt-2 h-2" />
            <Button size="sm" variant="outline" className="rounded-full mt-3" onClick={() => contributeGoal(g.id, 50)}>+ {brl(50)}</Button>
          </Card>
        );
      })}
    </div>
  );
}