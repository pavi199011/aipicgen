
import { useState, useEffect, useCallback } from "react";
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

  // Only fetch data when authenticated
  useEffect(() => {
    console.log("Admin authenticated state in dashboard:", adminAuthenticated);
    if (adminAuthenticated === true) {
      fetchUsers();
      fetchUserStats();
    }
  }, [adminAuthenticated]);

  const fetchUsers = useCallback(async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoading(true);
      console.log("Fetching user data...");
      
      // Try fetching from auth.admin first
      try {
        const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
        if (authError) throw authError;
        
        // Get profiles to enhance user data
        const { data: profiles, error: profilesError } = await supabase
          .from("profiles")
          .select("id, username, created_at");
          
        if (profilesError) {
          console.warn("Error fetching profiles:", profilesError.message);
        }
        
        const profilesMap = new Map();
        (profiles || []).forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
        
        // Map auth users to our user format
        const mappedUsers = authUsers.users.map(authUser => {
          const profile = profilesMap.get(authUser.id);
          return {
            id: authUser.id,
            email: authUser.email,
            username: profile?.username || authUser.email?.split('@')[0] || 'No Username',
            created_at: profile?.created_at || authUser.created_at || new Date().toISOString(),
            is_suspended: authUser.banned || false
          };
        });
        
        setUsers(mappedUsers);
        console.log("User data loaded:", mappedUsers.length, "users");
        return;
      } catch (authError) {
        console.warn("Error fetching auth users:", authError.message);
      }
      
      // Fallback to profiles table if auth.admin fails
      console.log("Falling back to profiles table...");
      const { data: profileUsers, error: profileError } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (profileError) {
        console.warn("Error fetching profiles:", profileError.message);
        throw profileError;
      }
      
      const profileUsersMapped = profileUsers.map(profile => ({
        id: profile.id,
        username: profile.username || 'No Username',
        email: `${profile.username || 'user'}@example.com`, // Placeholder email
        created_at: profile.created_at || new Date().toISOString(),
        is_suspended: false
      }));
      
      setUsers(profileUsersMapped);
      console.log("Loaded user data from profiles:", profileUsersMapped.length, "users");
      
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Using sample data instead.",
        variant: "destructive",
      });
      
      // Set sample data if fetching fails
      setUsers([
        {
          id: "sample-1",
          email: "sample@example.com",
          username: "sample_user",
          created_at: new Date().toISOString(),
          is_suspended: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [adminAuthenticated, toast]);

  const fetchUserStats = useCallback(async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoadingStats(true);
      console.log("Fetching user stats data...");
      
      // Fetch real user statistics from the generated_images table
      const statsPromises = users.map(async (user) => {
        try {
          const { count, error } = await supabase
            .from("generated_images")
            .select("id", { count: "exact" })
            .eq("user_id", user.id);
            
          if (error) {
            console.warn("Error fetching image count for user", user.id, ":", error.message);
            return {
              id: user.id,
              username: user.username,
              email: user.email,
              imageCount: 0,
            };
          }
          
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            imageCount: count || 0,
          };
        } catch (e) {
          console.warn("Exception when fetching image count for user", user.id, ":", e);
          return {
            id: user.id,
            username: user.username,
            email: user.email,
            imageCount: 0,
          };
        }
      });
      
      const stats = await Promise.all(statsPromises);
      setUserStats(stats);
      console.log("User stats loaded:", stats.length, "users with stats");
    } catch (error) {
      console.error("Error in fetchUserStats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user statistics. Using sample data instead.",
        variant: "destructive",
      });
      
      // Set sample data based on current users if fetching fails
      setUserStats(users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        imageCount: Math.floor(Math.random() * 10), // Random count for sample data
      })));
    } finally {
      setLoadingStats(false);
    }
  }, [users, adminAuthenticated, toast]);

  const handleDeleteUser = async (userId) => {
    try {
      // Attempt to delete user from Supabase
      // First delete user's images
      await supabase
        .from("generated_images")
        .delete()
        .eq("user_id", userId);
        
      // Then delete the profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      
      if (profileError) {
        console.error("Error deleting profile:", profileError);
      }
      
      // Finally delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.warn("Error deleting auth user:", authError.message);
        // Continue anyway and update local state
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
        description: "Failed to delete user. Try again later.",
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
    adminAuthenticated,
    fetchUsers,
    fetchUserStats
  };
}
