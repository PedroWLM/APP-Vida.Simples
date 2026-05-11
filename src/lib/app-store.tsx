import { createContext, useContext, useState, type ReactNode } from "react";
import type {
  AppMode, Task, Habit, Income, Expense, Bill, Debt, Goal, Device, UserProfile,
} from "./vida-types";

const today = new Date().toISOString().slice(0, 10);
const inDays = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

interface AppState {
  user: UserProfile;
  tasks: Task[];
  habits: Habit[];
  incomes: Income[];
  expenses: Expense[];
  bills: Bill[];
  debts: Debt[];
  goals: Goal[];
  devices: Device[];
  setMode: (m: AppMode) => void;
  setUser: (u: Partial<UserProfile>) => void;
  toggleTask: (id: string) => void;
  addTask: (t: Omit<Task, "id" | "status">) => void;
  toggleHabit: (id: string) => void;
  addHabit: (h: Omit<Habit, "id" | "completedDates">) => void;
  addExpense: (e: Omit<Expense, "id">) => void;
  addIncome: (i: Omit<Income, "id">) => void;
  addBill: (b: Omit<Bill, "id" | "status">) => void;
  payBill: (id: string) => void;
  addDebt: (d: Omit<Debt, "id">) => void;
  addGoal: (g: Omit<Goal, "id" | "currentAmount">) => void;
  contributeGoal: (id: string, amount: number) => void;
  removeDevice: (id: string) => void;
}

const Ctx = createContext<AppState | null>(null);

const initialUser: UserProfile = {
  name: "Pedro",
  mode: "tdah",
  subscriptionStatus: "trial",
  trialEndsAt: inDays(7),
  deviceLimit: 2,
};

const initialTasks: Task[] = [
  { id: "t1", title: "Revisar agenda", date: today, period: "manha", priority: "media", status: "pendente" },
  { id: "t2", title: "Estudar 15 minutos", date: today, period: "tarde", priority: "alta", status: "pendente",
    steps: ["Abrir o material", "Ler o título", "Estudar 10 minutos", "Marcar como iniciado"] },
  { id: "t3", title: "Organizar uma conta", date: today, period: "noite", priority: "media", status: "pendente" },
];

const initialHabits: Habit[] = [
  { id: "h1", title: "Beber água", frequency: "diario", period: "manha", completedDates: [today] },
  { id: "h2", title: "Revisar dinheiro", frequency: "diario", period: "tarde", completedDates: [] },
  { id: "h3", title: "Caminhar 10 minutos", frequency: "diario", period: "noite", completedDates: [] },
];

const initialIncomes: Income[] = [
  { id: "i1", name: "Salário", amount: 1500, date: inDays(-2), recurring: true },
];

const initialExpenses: Expense[] = [
  { id: "e1", name: "Almoço", amount: 32, category: "alimentação", date: today },
  { id: "e2", name: "Ônibus", amount: 12, category: "transporte", date: today },
];

const initialBills: Bill[] = [
  { id: "b1", name: "Internet", amount: 99.9, dueDate: today, recurring: true, status: "pendente" },
  { id: "b2", name: "Faculdade", amount: 300, dueDate: inDays(5), recurring: true, status: "pendente" },
];

const initialDebts: Debt[] = [
  { id: "d1", name: "Cartão", totalAmount: 800, remainingAmount: 400, installments: 4, installmentAmount: 100, dueDate: inDays(10), priority: "alta" },
];

const initialGoals: Goal[] = [
  { id: "g1", name: "Reserva de emergência", type: "reserva", targetAmount: 500, currentAmount: 80 },
];

const initialDevices: Device[] = [
  { id: "dv1", deviceName: "Celular Android", deviceType: "celular", lastAccess: today, active: true },
  { id: "dv2", deviceName: "Computador", deviceType: "computador", lastAccess: today, active: true },
];

const uid = () => Math.random().toString(36).slice(2, 10);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile>(initialUser);
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [habits, setHabits] = useState<Habit[]>(initialHabits);
  const [incomes, setIncomes] = useState<Income[]>(initialIncomes);
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [bills, setBills] = useState<Bill[]>(initialBills);
  const [debts, setDebts] = useState<Debt[]>(initialDebts);
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [devices, setDevices] = useState<Device[]>(initialDevices);

  const value: AppState = {
    user, tasks, habits, incomes, expenses, bills, debts, goals, devices,
    setMode: (m) => setUserState((u) => ({ ...u, mode: m })),
    setUser: (u) => setUserState((s) => ({ ...s, ...u })),
    toggleTask: (id) => setTasks((ts) => ts.map((t) => t.id === id ? { ...t, status: t.status === "feita" ? "pendente" : "feita" } : t)),
    addTask: (t) => setTasks((ts) => [...ts, { ...t, id: uid(), status: "pendente" }]),
    toggleHabit: (id) => setHabits((hs) => hs.map((h) => {
      if (h.id !== id) return h;
      const has = h.completedDates.includes(today);
      return { ...h, completedDates: has ? h.completedDates.filter((d) => d !== today) : [...h.completedDates, today] };
    })),
    addHabit: (h) => setHabits((hs) => [...hs, { ...h, id: uid(), completedDates: [] }]),
    addExpense: (e) => setExpenses((es) => [...es, { ...e, id: uid() }]),
    addIncome: (i) => setIncomes((is) => [...is, { ...i, id: uid() }]),
    addBill: (b) => setBills((bs) => [...bs, { ...b, id: uid(), status: "pendente" }]),
    payBill: (id) => setBills((bs) => bs.map((b) => b.id === id ? { ...b, status: "paga" } : b)),
    addDebt: (d) => setDebts((ds) => [...ds, { ...d, id: uid() }]),
    addGoal: (g) => setGoals((gs) => [...gs, { ...g, id: uid(), currentAmount: 0 }]),
    contributeGoal: (id, amount) => setGoals((gs) => gs.map((g) => g.id === id ? { ...g, currentAmount: g.currentAmount + amount } : g)),
    removeDevice: (id) => setDevices((ds) => ds.filter((d) => d.id !== id)),
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useApp() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useApp must be used within AppStoreProvider");
  return v;
}

export function todayISO() { return today; }
export function daysFromToday(iso: string) {
  const a = new Date(iso).setHours(0, 0, 0, 0);
  const b = new Date(today).setHours(0, 0, 0, 0);
  return Math.round((a - b) / 86400000);
}
export function brl(n: number) {
  return n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}