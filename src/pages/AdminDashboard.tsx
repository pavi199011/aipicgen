
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { AdminDashboardLoading } from "@/components/admin/AdminDashboardLoading";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const {
    activeTab,
    setActiveTab,
    users,
    userStats,
    loading: dataLoading,
    loadingStats,
    handleDeleteUser,
    handleSignOut,
    totalUsers,
    totalImages,
    avgImagesPerUser,
    adminAuthenticated,
    fetchUsers,
    fetchUserStats
  } = useAdminDashboard();
  
  // Set up data loading from auth.users
  const { users: authUsers, realtimeStats, fetchAllData } = useAdminRealtime();
  const { toast } = useToast();
  
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab from URL hash
  useEffect(() => {
    if (location.hash) {
      const hash = location.hash.replace('#', '');
      setActiveTab(hash);
    } else {
      setActiveTab("overview");
    }
  }, [location.hash, setActiveTab]);

  // Handle authentication redirect
  useEffect(() => {
    console.log("Admin dashboard auth check:", adminAuthenticated);
    
    if (adminAuthenticated === false && !isRedirecting) {
      console.log("User not authenticated, redirecting to login");
      setIsRedirecting(true);
      navigate("/admin/login");
    }
  }, [adminAuthenticated, navigate, isRedirecting]);

  // Initial data load
  useEffect(() => {
    const fetchData = async () => {
      console.log("Initial data fetch for admin dashboard");
      try {
        fetchAllData();
      } catch (error) {
        console.error("Error in initial data fetch:", error);
      }
    };
    
    fetchData();
  }, [fetchAllData]);

  // Show loading state only while checking authentication
  if (adminAuthenticated === undefined) {
    return <AdminDashboardLoading />;
  }

  // Use auth users when available, fallback to regular users
  const displayUsers = authUsers.length > 0 ? authUsers : users;
  const displayStats = realtimeStats.length > 0 ? realtimeStats : userStats;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <AdminDashboardContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          users={displayUsers}
          userStats={displayStats}
          loading={dataLoading}
          loadingStats={loadingStats}
          totalUsers={displayUsers.length || 0}
          totalImages={displayStats.reduce((sum, user) => sum + user.imageCount, 0)}
          avgImagesPerUser={displayUsers.length > 0 
            ? (displayStats.reduce((sum, user) => sum + user.imageCount, 0) / displayUsers.length).toFixed(1)
            : "0.0"}
          onDeleteUser={handleDeleteUser}
          onRefreshUsers={fetchAllData}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
