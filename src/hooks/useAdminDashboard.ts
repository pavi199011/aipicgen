
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

  // Only fetch data when authenticated and when mounting
  useEffect(() => {
    console.log("Admin authenticated state in dashboard:", adminAuthenticated);
    if (adminAuthenticated === true) {
      // Use a slight delay to avoid race conditions
      const timer = setTimeout(() => {
        fetchUsers();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [adminAuthenticated, fetchUsers]);

  // Fetch stats separately after users are loaded
  useEffect(() => {
    if (adminAuthenticated === true && users.length > 0) {
      fetchUserStats();
    }
  }, [adminAuthenticated, users, fetchUserStats]);

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
