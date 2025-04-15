
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { AdminDashboardLoading } from "@/components/admin/AdminDashboardLoading";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";
import { useToast } from "@/hooks/use-toast";

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
  
  // Set up realtime updates
  const { isSubscribed, realtimeUsers, realtimeStats, fetchAllData } = useAdminRealtime();
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

  // Refresh data periodically using realtime data when available
  useEffect(() => {
    if (adminAuthenticated === true && isSubscribed) {
      const intervalId = setInterval(() => {
        console.log("Refreshing admin dashboard data from realtime...");
        fetchAllData();
      }, 30000); // Refresh every 30 seconds
      
      // Notify user that real-time updates are active
      toast({
        title: "Admin Dashboard Active",
        description: `Real-time updates ${isSubscribed ? 'enabled' : 'connecting...'}`,
      });
      
      return () => clearInterval(intervalId);
    }
  }, [adminAuthenticated, isSubscribed, fetchAllData, toast]);

  // Show loading state only while checking authentication
  if (adminAuthenticated === undefined) {
    return <AdminDashboardLoading />;
  }

  // Safety check to prevent rendering when not authenticated
  if (adminAuthenticated === false) {
    return null;
  }

  // Use realtime data if available, otherwise fall back to regular data
  const displayUsers = realtimeUsers.length > 0 ? realtimeUsers : users;
  const displayStats = realtimeStats.length > 0 ? realtimeStats : userStats;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <div className="mb-4">
          {isSubscribed ? (
            <div className="p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded text-sm text-green-800 dark:text-green-200">
              Real-time updates are active. Data will refresh automatically.
            </div>
          ) : (
            <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded text-sm text-yellow-800 dark:text-yellow-200">
              Setting up real-time updates...
            </div>
          )}
        </div>
        
        <AdminDashboardContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          users={displayUsers}
          userStats={displayStats}
          loading={dataLoading && displayUsers.length === 0}
          loadingStats={loadingStats && displayStats.length === 0}
          totalUsers={displayUsers.length}
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
