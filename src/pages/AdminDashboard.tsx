
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "next-themes";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";
import { AdminDashboardLayout } from "@/components/admin/AdminDashboardLayout";
import { AdminTabs } from "@/components/admin/AdminTabs";

const AdminDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const mockAdminUser = {
    id: "admin-user-id",
    email: "admin@pixelpalette.tech"
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
  
  useEffect(() => {
    console.log("AdminDashboard mounting, triggering data fetch");
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Updated to return a Promise to match the updated interface
  const mockSignOut = async (): Promise<void> => {
    navigate("/");
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
      mockSignOut();
    }
  };

  console.log("Admin Dashboard rendering with users:", users);

  const currentAdmins = [
    { id: '1', email: 'admin@pixelpalette.tech' }
  ];

  return (
    <AdminDashboardLayout
      signOut={mockSignOut}
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
