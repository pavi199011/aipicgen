
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { UserStatistics } from "@/components/admin/UserStatistics";
import { AdminManagement } from "@/components/admin/AdminManagement";
import { UserCreationForm } from "@/components/admin/UserCreationForm";
import { useAdminData } from "@/hooks/useAdminData";
import { useToast } from "@/hooks/use-toast";
import { AdminSystemPanel } from "@/components/admin/AdminSystemPanel";
import { AdminActivityLog } from "@/components/admin/AdminActivityLog";

const AdminDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();
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
    const handleHashChange = () => {
      const hash = location.hash.replace('#', '') || "dashboard";
      setCurrentTab(hash);
    };
    
    handleHashChange();
    
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [location.hash]);

  useEffect(() => {
    console.log("AdminDashboard mounting, triggering data fetch");
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const mockSignOut = async () => {
    navigate("/");
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

  const totalImages = userStats.reduce((acc, user) => acc + user.imageCount, 0);
  const avgImagesPerUser = userStats.length > 0 
    ? (totalImages / userStats.length).toFixed(1) 
    : '0';

  console.log("Admin Dashboard rendering with users:", users);

  const currentAdmins = [
    { id: '1', email: 'admin@pixelpalette.tech' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 mb-0">
        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-700 dark:text-yellow-300">
          <strong>Development Mode:</strong> Admin authentication is bypassed. In production, proper authentication would be required.
        </AlertDescription>
      </Alert>
      
      <div className="flex">
        <AdminSidebar signOut={mockSignOut} currentTab={currentTab} />
        
        <div className="flex-1 lg:ml-64">
          <DashboardHeader 
            toggleTheme={toggleTheme} 
            isDarkMode={theme === "dark"} 
            onAction={handleHeaderAction}
          />
          
          <div className="p-6">
            <Tabs defaultValue={currentTab} value={currentTab} onValueChange={(value) => {
              setCurrentTab(value);
              navigate(`/admin-portal#${value}`);
            }}>
              <TabsList className="mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
                <TabsTrigger value="add-user">Add User</TabsTrigger>
                <TabsTrigger value="system">System</TabsTrigger>
                <TabsTrigger value="activity">Activity Log</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard" className="space-y-6">
                <DashboardOverview 
                  userCount={users.length}
                  totalImages={totalImages}
                  avgImagesPerUser={avgImagesPerUser}
                  loading={loading}
                  loadingStats={loadingStats}
                />
              </TabsContent>
              
              <TabsContent value="users">
                <UserManagement 
                  users={users}
                  loading={loading}
                  onDeleteUser={deleteUser}
                  userStats={userStats}
                />
              </TabsContent>
              
              <TabsContent value="statistics">
                <UserStatistics 
                  userStats={userStats}
                  loadingStats={loadingStats}
                  onDeleteUser={deleteUser}
                />
              </TabsContent>

              <TabsContent value="add-user">
                <h2 className="text-2xl font-bold mb-6">Create New User</h2>
                <div className="max-w-md mx-auto">
                  <UserCreationForm onCreateUser={createUser} />
                </div>
              </TabsContent>
              
              <TabsContent value="system">
                <AdminSystemPanel />
              </TabsContent>
              
              <TabsContent value="activity">
                <AdminActivityLog />
              </TabsContent>
              
              <TabsContent value="settings">
                <AdminManagement 
                  currentAdmins={currentAdmins}
                  onAddAdmin={addAdmin}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
