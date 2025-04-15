
import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const { adminAuthenticated, adminLogout } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    // Only fetch data if the user is authenticated
    if (adminAuthenticated) {
      fetchUsers();
      fetchUserStats();
    }
  }, [adminAuthenticated]);

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

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
      
      if (authError) {
        console.error("Error fetching users for stats:", authError);
        return;
      }
      
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username");
        
      if (profilesError) {
        console.error("Error fetching profiles for stats:", profilesError);
      }
      
      const profilesMap = new Map();
      (profiles || []).forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
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

  const handleSignOut = () => {
    adminLogout();
    toast({
      title: "Signed Out",
      description: "You have been signed out of the admin portal",
    });
  };

  return {
    activeTab,
    setActiveTab,
    users,
    userStats,
    loading,
    loadingStats,
    handleDeleteUser,
    handleSignOut,
    totalUsers: users.length,
    totalImages: userStats.reduce((sum, user) => sum + user.imageCount, 0),
    avgImagesPerUser: users.length > 0 
      ? (userStats.reduce((sum, user) => sum + user.imageCount, 0) / users.length).toFixed(1) 
      : "0.0",
    adminAuthenticated
  };
}
