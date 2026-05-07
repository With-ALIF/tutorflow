import { useState, useEffect, useContext } from "react";
import { ToastContext } from "../../../context/ToastContext";
import { fetchDashboardData } from "../services/dashboardService";
import { Stats } from "../types/dashboard.types";

export const useDashboard = () => {
  const { showToast } = useContext(ToastContext);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await fetchDashboardData();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        showToast("Failed to fetch stats", "error");
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [showToast]);

  return { stats, loading };
};
