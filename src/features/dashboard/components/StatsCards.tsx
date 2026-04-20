import React from "react";
import { StatCard } from "./StatCard";
import { getDashboardCards } from "../constants/dashboardCards";

export const StatsCards = ({ stats }: { stats: any }) => {
  const cards = getDashboardCards(stats);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {cards.map((card, idx) => (
        <StatCard key={card.label} {...card} delay={idx * 0.1} />
      ))}
    </div>
  );
};
