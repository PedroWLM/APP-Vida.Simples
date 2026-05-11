export type AppMode = "simple" | "tdah";

export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string; // ISO date
  period: "manha" | "tarde" | "noite";
  priority: "baixa" | "media" | "alta";
  status: "pendente" | "feita";
  steps?: string[];
}

export interface Habit {
  id: string;
  title: string;
  frequency: "diario" | "semanal" | "dias";
  period: "manha" | "tarde" | "noite";
  completedDates: string[];
}

export interface Income {
  id: string;
  name: string;
  amount: number;
  date: string;
  recurring: boolean;
}

export interface Expense {
  id: string;
  name: string;
  amount: number;
  category: string;
  date: string;
  description?: string;
}

export interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  recurring: boolean;
  status: "pendente" | "paga" | "atrasada";
}

export interface Debt {
  id: string;
  name: string;
  totalAmount: number;
  remainingAmount: number;
  installments: number;
  installmentAmount: number;
  dueDate: string;
  priority: "baixa" | "media" | "alta";
}

export interface Goal {
  id: string;
  name: string;
  type: "reserva" | "quitar" | "comprar" | "investir" | "outro";
  targetAmount: number;
  currentAmount: number;
  deadline?: string;
}

export interface Device {
  id: string;
  deviceName: string;
  deviceType: "celular" | "computador" | "tablet";
  lastAccess: string;
  active: boolean;
}

export interface UserProfile {
  name: string;
  mode: AppMode;
  subscriptionStatus: "trial" | "ativa" | "inativa";
  trialEndsAt?: string;
  deviceLimit: number;
}