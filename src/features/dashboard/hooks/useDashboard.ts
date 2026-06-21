import { useState, useEffect, useContext } from "react";
import { ToastContext } from "../../../context/ToastContext";
import { fetchDashboardData } from "../services/dashboardService";
import { Stats } from "../types/dashboard.types";
import { supabase } from "../../../lib/supabase";

export const useDashboard = () => {
  const { showToast } = useContext(ToastContext);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadStats = async () => {
      if (!isActive) return;
      setLoading(true);
      try {
        const data = await fetchDashboardData();
        if (isActive) setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // showToast("Failed to fetch stats", "error"); // Less intrusive if it fails during login
      } finally {
        if (isActive) setLoading(false);
      }
    };

    const { data: { subscription: authListener } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user && isActive) {
        loadStats();
      } else if (!session && isActive) {
        setStats(null);
        setLoading(false);
      }
    });

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && isActive) {
        loadStats();
      } else if (!session && isActive) {
        setLoading(false);
      }
    });

    return () => {
      isActive = false;
      authListener.unsubscribe();
    };
  }, []);

  return { stats, loading };
};
