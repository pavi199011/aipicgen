
import { useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminDashboardState } from "@/hooks/admin/useAdminDashboardState";
import { useAdminUserData } from "@/hooks/admin/useAdminUserData";
import { useAdminUserStats } from "@/hooks/admin/useAdminUserStats";
import { useAdminActions } from "@/hooks/admin/useAdminActions";

export function useAdminDashboard() {
  const { adminAuthenticated } = useAdminAuth();
  const { 
    activeTab, setActiveTab,
    users, setUsers,
    userStats, setUserStats,
    loading, setLoading,
    loadingStats, setLoadingStats
  } = useAdminDashboardState();
  
  const { fetchUsers, handleDeleteUser } = useAdminUserData(
    setUsers, 
    setLoading, 
    adminAuthenticated
  );
  
  const { fetchUserStats, calculateStats } = useAdminUserStats(
    users, 
    setUserStats, 
    setLoadingStats, 
    adminAuthenticated
  );
  
  const { handleSignOut } = useAdminActions();

  // Only fetch data when authenticated
  useEffect(() => {
    console.log("Admin authenticated state in dashboard:", adminAuthenticated);
    if (adminAuthenticated === true) {
      fetchUsers();
      fetchUserStats();
    }
  }, [adminAuthenticated, fetchUsers, fetchUserStats]);

  // Calculate statistics
  const { totalUsers, totalImages, avgImagesPerUser } = calculateStats(users, userStats);

  return {
    activeTab,
    setActiveTab,
    users,
    userStats,
    loading,
    loadingStats,
    handleDeleteUser,
    handleSignOut,
    totalUsers,
    totalImages,
    avgImagesPerUser,
    adminAuthenticated,
    fetchUsers,
    fetchUserStats
  };
}
