import { 
  ShoppingBag, 
  Truck, 
  Book, 
  Coffee, 
  MoreHorizontal, 
  PenTool, 
  Home, 
  Zap, 
  Wallet, 
  Megaphone, 
  HelpCircle 
} from "lucide-react";
import { ExpenseCategory } from "../types/expense.types";

export const categoryIcons: Record<ExpenseCategory, any> = {
  Transport: Truck,
  Books: Book,
  Supplies: ShoppingBag,
  Food: Coffee,
  Stationery: PenTool,
  Rent: Home,
  Utilities: Zap,
  Salaries: Wallet,
  Marketing: Megaphone,
  Miscellaneous: HelpCircle,
  Others: MoreHorizontal
};

export const categoryColors: Record<ExpenseCategory, string> = {
  Transport: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
  Books: "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
  Supplies: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
  Food: "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
  Stationery: "text-emerald-500 bg-emerald-50 dark:bg-emerald-500/10",
  Rent: "text-rose-500 bg-rose-50 dark:bg-rose-500/10",
  Utilities: "text-cyan-500 bg-cyan-50 dark:bg-cyan-500/10",
  Salaries: "text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10",
  Marketing: "text-pink-500 bg-pink-50 dark:bg-pink-500/10",
  Miscellaneous: "text-teal-500 bg-teal-50 dark:bg-teal-500/10",
  Others: "text-slate-500 bg-slate-50 dark:bg-slate-500/10"
};
