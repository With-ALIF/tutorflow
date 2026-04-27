import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { AttendanceItem } from "./AttendanceItem";

export const RecentAttendance = ({ activity }: { activity: any[] }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    className="bg-white dark:bg-slate-800 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden"
  >
    <div className="p-6 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">Recent Attendance</h2>
      <Link to="/attendance" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700">View All</Link>
    </div>
    <div className="p-6">
      {activity.length ? (
        <div className="space-y-6">
          {activity.map((act, idx) => (
            <AttendanceItem key={idx} activity={act} />
          ))}
        </div>
      ) : (
        <p className="text-center text-slate-500 dark:text-slate-400 py-8">No recent activity</p>
      )}
    </div>
  </motion.div>
);
