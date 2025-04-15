
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { AdminDashboardLoading } from "@/components/admin/AdminDashboardLoading";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";

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
  const { isSubscribed, fetchAllData } = useAdminRealtime();
  
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

  // Fetch data when the tab changes or component mounts, with a delay
  useEffect(() => {
    if (adminAuthenticated === true) {
      // Add a small delay to ensure authentication is fully processed
      const timer = setTimeout(() => {
        fetchUsers();
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [adminAuthenticated, fetchUsers, activeTab]);

  // Fetch stats when users data is loaded
  useEffect(() => {
    if (adminAuthenticated === true && users.length > 0) {
      fetchUserStats();
    }
  }, [adminAuthenticated, users, fetchUserStats]);

  // Refresh data periodically using realtime data when available
  useEffect(() => {
    if (adminAuthenticated === true && isSubscribed) {
      const intervalId = setInterval(() => {
        console.log("Refreshing data from realtime...");
        fetchAllData();
      }, 30000); // Refresh every 30 seconds
      
      return () => clearInterval(intervalId);
    }
  }, [adminAuthenticated, isSubscribed, fetchAllData]);

  // Show loading state only while checking authentication
  if (adminAuthenticated === undefined) {
    return <AdminDashboardLoading />;
  }

  // Safety check to prevent rendering when not authenticated
  if (adminAuthenticated === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <AdminDashboardContent
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          users={users}
          userStats={userStats}
          loading={dataLoading}
          loadingStats={loadingStats}
          totalUsers={totalUsers}
          totalImages={totalImages}
          avgImagesPerUser={avgImagesPerUser}
          onDeleteUser={handleDeleteUser}
          onRefreshUsers={fetchUsers}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
