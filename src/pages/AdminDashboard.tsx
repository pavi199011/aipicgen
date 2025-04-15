
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminDashboardContent } from "@/components/admin/AdminDashboardContent";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";
import { AdminDashboardLoading } from "@/components/admin/AdminDashboardLoading";

const AdminDashboard = () => {
  const {
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
  } = useAdminDashboard();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab from URL hash
  useEffect(() => {
    const hash = location.hash.replace('#', '') || "overview";
    setActiveTab(hash);
  }, [location.hash, setActiveTab]);

  // Handle authentication redirect
  useEffect(() => {
    if (adminAuthenticated === false) {
      console.log("User not authenticated, redirecting to login");
      setIsRedirecting(true);
      navigate("/admin/login");
    }
  }, [adminAuthenticated, navigate]);

  // Don't fetch data until authentication is confirmed
  useEffect(() => {
    if (adminAuthenticated === true) {
      console.log("Fetching dashboard data...");
      if (activeTab === "users" || activeTab === "overview") {
        fetchUsers();
      }
      if (activeTab === "statistics" || activeTab === "overview") {
        fetchUserStats();
      }
    }
  }, [activeTab, adminAuthenticated, fetchUsers, fetchUserStats]);

  // Show loading state while checking authentication
  if (loading || adminAuthenticated === undefined || isRedirecting) {
    return <AdminDashboardLoading />;
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
          loading={loading}
          loadingStats={loadingStats}
          totalUsers={totalUsers}
          totalImages={totalImages}
          avgImagesPerUser={avgImagesPerUser}
          onDeleteUser={handleDeleteUser}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
