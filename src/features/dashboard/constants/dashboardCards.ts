import { Users, CreditCard, Receipt, TrendingUp, TrendingDown, Wallet } from "lucide-react";

export const getDashboardCards = (stats: any) => {
  const income = stats?.monthlyIncome || 0;
  const expenses = stats?.monthlyExpenses || 0;
  const netProfit = income - expenses;

  return [
    {
      label: "Total Students",
      value: stats?.totalStudents || 0,
      icon: Users,
      color: "from-blue-500 to-indigo-600",
      link: "/students"
    },
    {
      label: "Monthly Income",
      value: `৳${income.toLocaleString()}`,
      icon: CreditCard,
      color: "from-emerald-500 to-teal-600",
      link: "/fees"
    },
    {
      label: "Monthly Expenses",
      value: `৳${expenses.toLocaleString()}`,
      icon: TrendingDown,
      color: "from-amber-500 to-orange-600",
      link: "/expenses"
    },
    {
      label: "Net Profit",
      value: `৳${netProfit.toLocaleString()}`,
      icon: Wallet,
      color: "from-purple-500 to-pink-600",
      link: "/"
    }
  ];
};
