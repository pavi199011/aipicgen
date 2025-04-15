
import { useState } from "react";
import { User, UserStats } from "@/types/admin";

/**
 * Hook to manage the state for the admin dashboard
 */
export function useAdminDashboardState() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);

  return {
    activeTab,
    setActiveTab,
    users,
    setUsers,
    userStats,
    setUserStats,
    loading,
    setLoading,
    loadingStats,
    setLoadingStats
  };
}
