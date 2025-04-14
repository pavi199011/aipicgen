
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAdminData } from "@/hooks/useAdminData";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { AdminDashboardLayout } from "@/components/admin/AdminDashboardLayout";
import { AdminTabs } from "@/components/admin/AdminTabs";
import { ADMIN_ROUTE } from "@/components/admin/AdminConstants";

const AdminDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { adminAuthenticated, adminLogout, loading: authLoading } = useAdminAuth();
  
  console.log("AdminDashboard - authenticated:", adminAuthenticated, "loading:", authLoading, "path:", location.pathname);
  
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
    console.log("Authentication check in AdminDashboard:", adminAuthenticated, "auth loading:", authLoading);
    
    // Only redirect when auth is not loading and user is not authenticated
    if (!authLoading && !adminAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate(`/${ADMIN_ROUTE}/login`);
    } else if (!authLoading && adminAuthenticated) {
      console.log("Admin is authenticated, loading data");
      setIsLoading(false);
      
      // Fetch data when authenticated
      fetchUsers();
      fetchUserStats();
    }
  }, [adminAuthenticated, authLoading, navigate, fetchUsers, fetchUserStats]);
  
  // Parse hash from URL for tab selection
  useEffect(() => {
    const hash = location.hash.replace('#', '') || "dashboard";
    if (hash !== currentTab) {
      setCurrentTab(hash);
    }
  }, [location.hash, currentTab]);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleSignOut = async (): Promise<void> => {
    adminLogout();
    navigate(`/${ADMIN_ROUTE}/login`);
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="inline-block animate-spin w-10 h-10 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated after loading is complete, show message
  if (!adminAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Redirecting to login...</p>
        </div>
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
