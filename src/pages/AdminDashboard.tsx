
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "next-themes";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { UserStatistics } from "@/components/admin/UserStatistics";
import { AdminManagement } from "@/components/admin/AdminManagement";
import { useAdminData } from "@/hooks/useAdminData";
import { ADMIN_ROUTE } from "@/components/admin/AdminConstants";

const AdminDashboard = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const [currentTab, setCurrentTab] = useState("dashboard");
  
  // Set up session timeout
  const [lastActivity, setLastActivity] = useState(Date.now());
  const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
  
  // Custom hook for admin data management
  const {
    users,
    userStats,
    loading,
    loadingStats,
    deleteUser
  } = useAdminData(user?.id);
  
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
  
  // Session timeout handler
  useEffect(() => {
    const activityHandler = () => setLastActivity(Date.now());
    
    // Attach event listeners for user activity
    window.addEventListener("mousemove", activityHandler);
    window.addEventListener("keydown", activityHandler);
    window.addEventListener("click", activityHandler);
    
    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity;
      
      if (timeSinceLastActivity > SESSION_TIMEOUT) {
        console.log("Session timeout - logging out");
        signOut();
      }
    }, 60000); // Check every minute
    
    return () => {
      window.removeEventListener("mousemove", activityHandler);
      window.removeEventListener("keydown", activityHandler);
      window.removeEventListener("click", activityHandler);
      clearInterval(intervalId);
    };
  }, [lastActivity, signOut]);
  
  // Toggle theme handler
  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!user) {
    return <Navigate to="/admin-auth" replace />;
  }

  if (isAdmin === false) {
    return <Navigate to="/admin-auth" replace />;
  }

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
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar signOut={signOut} />
        
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
