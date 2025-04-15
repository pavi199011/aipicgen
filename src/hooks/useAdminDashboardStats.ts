
import { useState, useEffect } from "react";
import type { DashboardStats } from "@/types/dashboardStats";
import { useUserStats } from "./admin/useUserStats";
import { useContentStats } from "./admin/useContentStats";
import { useActivityData } from "./admin/useActivityData";

export function useAdminDashboardStats(period: string = 'week') {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all parts of the dashboard data in parallel
        const [userStats, contentStats, activityData] = await Promise.all([
          useUserStats(period),
          useContentStats(),
          useActivityData()
        ]);

        // Combine all data into a single stats object
        setStats({
          users: userStats,
          content: contentStats,
          activityData
        });
      } catch (err: any) {
        console.error('Error fetching admin stats:', err);
        setError(err.message || 'Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [period]);

  return { stats, loading, error };
}

// Re-export the types for convenience
export type { DashboardStats } from "@/types/dashboardStats";
