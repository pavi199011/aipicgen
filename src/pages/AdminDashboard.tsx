
import { useTheme } from "next-themes";
import { useToast } from "@/hooks/use-toast";
import { useAdminDashboardData } from "@/hooks/useAdminDashboardData";
import { AdminDashboardLayout } from "@/components/admin/AdminDashboardLayout";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { AdminDashboardLoading } from "@/components/admin/AdminDashboardLoading";
import { AdminRedirectLoader } from "@/components/admin/AdminRedirectLoader";
import { ADMIN_ROUTE } from "@/components/admin/AdminConstants";
import { useNavigate } from "react-router-dom";

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

  const currentAdmins = [
    { id: '1', email: 'admin@example.com' }
  ];

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
        users={users}
        userStats={userStats}
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
