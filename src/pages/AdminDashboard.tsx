
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
    adminAuthenticated
  } = useAdminDashboard();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // If authentication check has completed and user is not authenticated
    if (adminAuthenticated === false) {
      console.log("User not authenticated, redirecting to login");
      setIsRedirecting(true);
      navigate("/admin/login");
    }
  }, [adminAuthenticated, navigate]);

  // Show loading state while checking authentication or loading data
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
