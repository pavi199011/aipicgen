
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { AdminDashboardLoading } from "@/components/admin/AdminDashboardLoading";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
  
  // Set up data loading from profiles
  const { users: realtimeUsers, realtimeStats, loading: realtimeLoading, fetchAllData } = useAdminRealtime();
  
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
    
    if (adminAuthenticated) {
      fetchData();
    }
  }, [adminAuthenticated, fetchAllData]);

  // Show loading state only while checking authentication
  if (adminAuthenticated === undefined) {
    return <AdminDashboardLoading />;
  }

  // Use realtime users when available, fallback to regular users
  const displayUsers = realtimeUsers.length > 0 ? realtimeUsers : users;
  const displayStats = realtimeStats.length > 0 ? realtimeStats : userStats;
  const isLoading = dataLoading || loadingStats || realtimeLoading;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          {isLoading && (
            <div className="flex items-center text-muted-foreground">
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              <span>Loading data...</span>
            </div>
          )}
        </div>
        
        <AdminDashboardContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          users={displayUsers}
          userStats={displayStats}
          loading={isLoading}
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
