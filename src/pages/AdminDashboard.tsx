
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";
import { useAdminRealtime } from "@/hooks/useAdminRealtime";
import { AdminDashboardLayout } from "@/components/admin/AdminDashboardLayout";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { AdminDashboardLoading } from "@/components/admin/AdminDashboardLoading";
import { AdminRedirectLoader } from "@/components/admin/AdminRedirectLoader";
import { ADMIN_ROUTE } from "@/components/admin/AdminConstants";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const AdminDashboard = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const {
    currentTab,
    isLoading,
    authLoading,
    adminAuthenticated,
    users,
    userStats,
    loading,
    loadingStats,
    deleteUser,
    fetchUsers,
    fetchUserStats,
    addAdmin,
    createUser,
    handleSignOut,
  } = useAdminDashboardData();
  
  // Set up real-time updates
  const { realtimeUsers, realtimeStats, isSubscribed } = useAdminRealtime();
  
  // Use real-time data when available
  const displayUsers = realtimeUsers.length > 0 ? realtimeUsers : users;
  const displayStats = realtimeStats.length > 0 ? realtimeStats : userStats;
  
  // Show toast when real-time connection is established
  useEffect(() => {
    if (isSubscribed) {
      toast({
        title: "Real-time Updates",
        description: "Connected to real-time data stream.",
      });
    }
  }, [isSubscribed, toast]);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleHeaderAction = (action: string) => {
    if (action === "profile") {
      toast({
        title: "Profile",
        description: "Profile functionality will be implemented soon.",
      });
    } else if (action === "settings") {
      navigate(`/${ADMIN_ROUTE}#settings`);
    } else if (action === "logout") {
      handleSignOut();
    }
  };

  // Use the actual admin data from the database
  const currentAdmins = users.filter(user => 
    user.email?.includes("admin") || user.username?.toLowerCase().includes("admin")
  );

  // Show loading state while authentication is being checked
  if (isLoading || authLoading) {
    return <AdminDashboardLoading />;
  }

  // If not authenticated after loading is complete, show redirect message
  if (!adminAuthenticated) {
    return <AdminRedirectLoader />;
  }

  return (
    <AdminDashboardLayout
      signOut={handleSignOut}
      currentTab={currentTab}
      isDarkMode={theme === "dark"}
      toggleTheme={toggleTheme}
      onHeaderAction={handleHeaderAction}
    >
      <AdminTabs
        users={displayUsers}
        userStats={displayStats}
        loading={loading}
        loadingStats={loadingStats}
        deleteUser={deleteUser}
        fetchUsers={fetchUsers}
        fetchUserStats={fetchUserStats}
        addAdmin={addAdmin}
        createUser={createUser}
        currentAdmins={currentAdmins}
      />
    </AdminDashboardLayout>
  );
};

export default AdminDashboard;
