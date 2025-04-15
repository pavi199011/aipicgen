
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { UserStatistics } from "@/components/admin/UserStatistics";
import { UserCreationForm } from "@/components/admin/UserCreationForm";
import { AdminSystemPanel } from "@/components/admin/AdminSystemPanel";
import { AdminActivityLog } from "@/components/admin/AdminActivityLog";
import { AdminManagement } from "@/components/admin/AdminManagement";
import { ADMIN_ROUTE } from "@/components/admin/AdminConstants";

interface AdminTabsProps {
  users: any[];
  userStats: any[];
  loading: boolean;
  loadingStats: boolean;
  deleteUser: (userId: string) => void;
  fetchUsers: () => void;
  fetchUserStats: () => void;
  addAdmin: (email: string, password: string) => Promise<void>;
  createUser: (data: { email: string, username: string, password: string }) => Promise<void>;
  currentAdmins: any[];
}

export const AdminTabs = ({
  users,
  userStats,
  loading,
  loadingStats,
  deleteUser,
  fetchUsers,
  fetchUserStats,
  addAdmin,
  createUser,
  currentAdmins
}: AdminTabsProps) => {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleHashChange = () => {
      const hash = location.hash.replace('#', '') || "dashboard";
      setCurrentTab(hash);
    };
    
    handleHashChange();
    
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, [location.hash]);

  // Force data refresh when tab changes to ensure content is up-to-date
  useEffect(() => {
    if (currentTab === "users" || currentTab === "dashboard") {
      fetchUsers();
    }
    if (currentTab === "statistics" || currentTab === "dashboard") {
      fetchUserStats();
    }
  }, [currentTab, fetchUsers, fetchUserStats]);

  const totalImages = userStats.reduce((acc, user) => acc + user.imageCount, 0);
  const avgImagesPerUser = users.length > 0 
    ? (totalImages / users.length).toFixed(1) 
    : '0';

  return (
    <Tabs defaultValue={currentTab} value={currentTab} onValueChange={(value) => {
      setCurrentTab(value);
      navigate(`/${ADMIN_ROUTE}#${value}`);
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
  );
};
