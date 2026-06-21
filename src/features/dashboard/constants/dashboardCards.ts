import { Users, CreditCard, Clock } from "lucide-react";

export const getDashboardCards = (stats: any) => {
  const income = stats?.monthlyIncome || 0;
  const dueFees = stats?.dueFees || 0;

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
      color: "from-indigo-500 to-indigo-700",
      link: "/fees"
    },
    {
      label: "Due Fees",
      value: `৳${dueFees.toLocaleString()}`,
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      link: "/fees"
    }
  ];
};
