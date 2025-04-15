
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { DashboardOverview } from "@/components/admin/DashboardOverview";
import { UserManagement } from "@/components/admin/UserManagement";
import { UserStatistics } from "@/components/admin/UserStatistics";
import { AdminManagement } from "@/components/admin/AdminManagement";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const { adminAuthenticated, adminLogout } = useAdminAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check if admin is authenticated
  useEffect(() => {
    if (!adminAuthenticated) {
      navigate("/admin/login");
    } else {
      fetchUsers();
      fetchUserStats();
    }
  }, [adminAuthenticated, navigate]);

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Error fetching users:", authError);
        return;
      }
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }
      
      // Combine auth users with profiles for display
      const formattedUsers = authUsers.users.map(user => {
        const profile = profiles?.find(p => p.id === user.id);
        return {
          id: user.id,
          email: user.email,
          username: profile?.username || user.email?.split('@')[0] || 'No Username',
          created_at: profile?.created_at || user.created_at,
          is_suspended: user.banned || false
        };
      });
      
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch user statistics (image counts)
  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      
      // Get all users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Error fetching users for stats:", authError);
        return;
      }
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username");
        
      if (profilesError) {
        console.error("Error fetching profiles for stats:", profilesError);
      }
      
      // Create a map of profiles for faster lookups
      const profilesMap = new Map();
      (profiles || []).forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
      // For each user, fetch their image count
      const statsPromises = authUsers.users.map(async (user) => {
        const profile = profilesMap.get(user.id);
        
        const { count, error } = await supabase
          .from("generated_images")
          .select("id", { count: "exact" })
          .eq("user_id", user.id);
          
        if (error) {
          console.error("Error fetching image count:", error);
          return {
            id: user.id,
            username: profile?.username || user.email?.split('@')[0] || 'No Username',
            email: user.email,
            imageCount: 0,
          };
        }
        
        return {
          id: user.id,
          username: profile?.username || user.email?.split('@')[0] || 'No Username',
          email: user.email,
          imageCount: count || 0,
        };
      });
      
      const stats = await Promise.all(statsPromises);
      setUserStats(stats);
      
    } catch (error) {
      console.error("Error in fetchUserStats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user statistics. Check console for details.",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  // Delete a user
  const handleDeleteUser = async (userId) => {
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        console.error("Error deleting user:", error);
        toast({
          title: "Error",
          description: "Failed to delete user. Check console for details.",
          variant: "destructive",
        });
        return;
      }
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      setUserStats(userStats.filter(stat => stat.id !== userId));
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error("Error in handleDeleteUser:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Check console for details.",
        variant: "destructive",
      });
    }
  };

  // Add a new admin (placeholder for now)
  const handleAddAdmin = async (email, password) => {
    toast({
      title: "Feature Coming Soon",
      description: "Adding new admins will be implemented in a future update.",
    });
  };

  // Calculate dashboard stats
  const totalUsers = users.length;
  
  // Calculate total images
  const totalImages = userStats.reduce((sum, user) => sum + user.imageCount, 0);
  
  // Calculate average images per user
  const avgImagesPerUser = totalUsers > 0 
    ? (totalImages / totalUsers).toFixed(1) 
    : "0.0";
  
  // Find current admins (placeholder)
  const currentAdmins = [
    { id: "admin-1", username: "admin_test", email: ADMIN_CREDENTIALS.email }
  ];

  // Handle sign out
  const handleSignOut = async () => {
    adminLogout();
    toast({
      title: "Signed Out",
      description: "You have been signed out of the admin portal",
    });
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <AdminHeader onSignOut={handleSignOut} />
      
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="overview">Dashboard</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
            <TabsTrigger value="statistics">User Statistics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
              onDeleteUser={handleDeleteUser}
            />
          </TabsContent>
          
          <TabsContent value="statistics">
            <UserStatistics 
              userStats={userStats}
              loadingStats={loadingStats}
              onDeleteUser={handleDeleteUser}
            />
          </TabsContent>
          
          <TabsContent value="settings">
            <AdminManagement 
              currentAdmins={currentAdmins}
              onAddAdmin={handleAddAdmin}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
