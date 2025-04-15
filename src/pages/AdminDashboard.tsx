
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
