
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { UserStatistics } from "@/components/admin/UserStatistics";
import { AdminManagement } from "@/components/admin/AdminManagement";
import { ADMIN_CREDENTIALS } from "@/components/admin/AdminConstants";
import { useEffect } from "react";

interface AdminDashboardContentProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  users: any[];
  userStats: any[];
  loading: boolean;
  loadingStats: boolean;
  totalUsers: number;
  totalImages: number;
  avgImagesPerUser: string;
  onDeleteUser: (userId: string) => void;
  onRefreshUsers?: () => void;
}

export const AdminDashboardContent = ({
  activeTab,
  setActiveTab,
  users,
  userStats,
  loading,
  loadingStats,
  totalUsers,
  totalImages,
  avgImagesPerUser,
  onDeleteUser,
  onRefreshUsers
}: AdminDashboardContentProps) => {
  const currentAdmins = [
    { id: "admin-1", username: "admin_test", email: ADMIN_CREDENTIALS.email }
  ];
  
  const handleAddAdmin = async (email, password) => {
    // This is a placeholder function
    return Promise.resolve();
  };

  // Ensure the tabs reflect the URL hash
  useEffect(() => {
    const hash = window.location.hash.replace('#', '') || "overview";
    if (hash !== activeTab) {
      setActiveTab(hash);
    }
  }, [window.location.hash, activeTab, setActiveTab]);

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid grid-cols-4 mb-8">
        <TabsTrigger value="overview" onClick={() => window.location.hash = "overview"}>Dashboard</TabsTrigger>
        <TabsTrigger value="users" onClick={() => window.location.hash = "users"}>User Management</TabsTrigger>
        <TabsTrigger value="statistics" onClick={() => window.location.hash = "statistics"}>User Statistics</TabsTrigger>
        <TabsTrigger value="settings" onClick={() => window.location.hash = "settings"}>Settings</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview">
        <DashboardOverview
          userCount={totalUsers}
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
          onDeleteUser={onDeleteUser}
          userStats={userStats}
          onRefreshUsers={onRefreshUsers}
        />
      </TabsContent>
      
      <TabsContent value="statistics">
        <UserStatistics 
          userStats={userStats}
          loadingStats={loadingStats}
          onDeleteUser={onDeleteUser}
        />
      </TabsContent>
      
      <TabsContent value="settings">
        <AdminManagement 
          currentAdmins={currentAdmins}
          onAddAdmin={handleAddAdmin}
        />
      </TabsContent>
    </Tabs>
  );
};
