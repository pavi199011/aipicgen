
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { UserStatistics } from "@/components/admin/UserStatistics";
import { useAdminData } from "@/hooks/useAdminData";

const AdminDashboard = () => {
  const { user, isAdmin, signOut } = useAuth();
  
  // Custom hook for admin data management
  const {
    users,
    userStats,
    loading,
    loadingStats,
    deleteUser
  } = useAdminData(user?.id);

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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <AdminSidebar signOut={signOut} />
        
        {/* Main content */}
        <div className="flex-1 p-8">
          <Tabs defaultValue="dashboard">
            <TabsList className="mb-6">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="statistics">Statistics</TabsTrigger>
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
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
