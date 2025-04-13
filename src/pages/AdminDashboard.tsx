
import { useState, useEffect } from "react";
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
import { useAdminData } from "@/hooks/useAdminData";
import { ADMIN_CREDENTIALS } from "@/components/admin/AdminConstants";

const AdminDashboard = () => {
  const { theme, setTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  // Simulate authenticated admin user for development
  const mockAdminUser = {
    id: "admin-user-id",
    email: ADMIN_CREDENTIALS.email
  };
  
  // Custom hook for admin data management
  const {
    users,
    userStats,
    loading,
    loadingStats,
    deleteUser
  } = useAdminData(mockAdminUser.id);
  
  // Update theme based on hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1) || "dashboard";
      setCurrentTab(hash);
    };
    
    // Initialize from current hash
    handleHashChange();
    
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);
  
  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Mock signOut function for sidebar
  const mockSignOut = async () => {
    window.location.href = "/";
  };

  // Calculate statistics for the dashboard
  const totalImages = userStats.reduce((acc, user) => acc + user.imageCount, 0);
  const avgImagesPerUser = userStats.length > 0 
    ? (totalImages / userStats.length).toFixed(1) 
    : '0';

  const currentAdmins = [
    { id: '1', email: 'admin@pixelpalette.tech' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Development Mode Warning */}
      <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 mb-0">
        <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        <AlertDescription className="text-yellow-700 dark:text-yellow-300">
          <strong>Development Mode:</strong> Admin authentication is bypassed. In production, proper authentication would be required.
        </AlertDescription>
      </Alert>
      
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar signOut={mockSignOut} />
        
        {/* Main content */}
        <div className="flex-1 lg:ml-64">
          {/* Header */}
          <DashboardHeader 
            toggleTheme={toggleTheme} 
            isDarkMode={theme === "dark"} 
          />
          
          {/* Content area */}
          <div className="p-6">
            <Tabs defaultValue={currentTab} value={currentTab} onValueChange={(value) => {
              setCurrentTab(value);
              window.location.hash = value;
            }}>
              <TabsList className="mb-6">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="statistics">Statistics</TabsTrigger>
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
              
              <TabsContent value="system">
                <h2 className="text-2xl font-bold mb-6">System Management</h2>
                <p className="text-muted-foreground">System health monitoring and management features will be implemented here.</p>
              </TabsContent>
              
              <TabsContent value="activity">
                <h2 className="text-2xl font-bold mb-6">Activity Log</h2>
                <p className="text-muted-foreground">Activity log and audit trail features will be implemented here.</p>
              </TabsContent>
              
              <TabsContent value="settings">
                <AdminManagement 
                  currentAdmins={currentAdmins}
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
