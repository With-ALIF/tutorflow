import React from "react";
import { Users } from "lucide-react";

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-500">
      <Users className="w-12 h-12 opacity-20" />
      <p className="text-sm font-medium">No students found</p>
    </div>
  );
};
