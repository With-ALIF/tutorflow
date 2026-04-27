import { useState, useEffect, useContext, useCallback } from "react";
import { expenseService } from "../services/expenseService";
import { Expense, NewExpense } from "../types/expense.types";
import { ToastContext } from "../../../context/ToastContext";

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useContext(ToastContext);

  const loadExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await expenseService.fetchExpenses();
      setExpenses(data);
    } catch (error) {
      console.error("Error loading expenses:", error);
      showToast("Failed to load expenses", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    loadExpenses();
  }, [loadExpenses]);

  const addExpense = async (expense: NewExpense) => {
    try {
      await expenseService.addExpense(expense);
      showToast("Expense added successfully");
      loadExpenses();
      return true;
    } catch (error) {
      showToast("Failed to add expense", "error");
      return false;
    }
  };

  const updateExpense = async (expense: Expense) => {
    try {
      await expenseService.updateExpense(expense);
      showToast("Expense updated successfully");
      loadExpenses();
      return true;
    } catch (error) {
      showToast("Failed to update expense", "error");
      return false;
    }
  };

  const deleteExpense = async (id: string) => {
    try {
      await expenseService.deleteExpense(id);
      showToast("Expense deleted successfully");
      loadExpenses();
      return true;
    } catch (error) {
      showToast("Failed to delete expense", "error");
      return false;
    }
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    refreshExpenses: loadExpenses
  };
};
