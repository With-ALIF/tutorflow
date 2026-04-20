import { ShoppingBag, Truck, Book, Coffee, MoreHorizontal } from "lucide-react";
import { ExpenseCategory } from "../types/expense.types";

export const categoryIcons: Record<ExpenseCategory, any> = {
  Transport: Truck,
  Books: Book,
  Supplies: ShoppingBag,
  Food: Coffee,
  Others: MoreHorizontal
};

export const categoryColors: Record<ExpenseCategory, string> = {
  Transport: "text-blue-500 bg-blue-50 dark:bg-blue-500/10",
  Books: "text-purple-500 bg-purple-50 dark:bg-purple-500/10",
  Supplies: "text-amber-500 bg-amber-50 dark:bg-amber-500/10",
  Food: "text-orange-500 bg-orange-50 dark:bg-orange-500/10",
  Others: "text-slate-500 bg-slate-50 dark:bg-slate-500/10"
};
