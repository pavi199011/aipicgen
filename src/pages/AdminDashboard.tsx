
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { AdminDashboardLayout } from "@/components/admin/AdminDashboardLayout";
import { AdminTabs } from "@/components/admin/AdminTabs";

const AdminDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  const { adminAuthenticated, adminLogout } = useAdminAuth();
  
  // Sample admin user for development
  const mockAdminUser = {
    id: "admin-user-id",
    email: "admin@example.com"
  };
  
  const {
    users,
    userStats,
    loading,
    loadingStats,
    deleteUser,
    fetchUsers,
    fetchUserStats,
    addAdmin,
    createUser
  } = useAdminData(mockAdminUser.id);
  
  // Check if user is authenticated
  useEffect(() => {
    if (!adminAuthenticated) {
      navigate("/admin-auth");
    }
  }, [adminAuthenticated, navigate]);
  
  useEffect(() => {
    console.log("AdminDashboard mounting, triggering data fetch");
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async (): Promise<void> => {
    adminLogout();
    navigate("/admin-auth");
    return Promise.resolve();
  };

  const handleHeaderAction = (action: string) => {
    if (action === "profile") {
      toast({
        title: "Profile",
        description: "Profile functionality will be implemented soon.",
      });
    } else if (action === "settings") {
      setCurrentTab("settings");
      navigate("/admin-portal#settings");
    } else if (action === "logout") {
      handleSignOut();
    }
  };

  console.log("Admin Dashboard rendering with users:", users);

  const currentAdmins = [
    { id: '1', email: 'admin@example.com' }
  ];

  // If not authenticated, show loading while redirecting
  if (!adminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
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
