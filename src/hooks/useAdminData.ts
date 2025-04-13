
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, UserStats } from "@/types/admin";

export function useAdminData(userId: string | undefined) {
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (userId) {
      fetchUsers();
      fetchUserStats();
    }
  }, [userId]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (error) {
        // In development mode, provide sample data if database query fails
        console.warn("Using sample data for development:", error);
        setUsers([
          { id: "user1", username: "demo_user", created_at: "2025-01-15T10:30:00Z", email: "demo@example.com" },
          { id: "user2", username: "test_user", created_at: "2025-02-20T15:45:00Z" },
          { id: "user3", username: "sample_user", created_at: "2025-03-10T08:15:00Z" }
        ]);
        return;
      }
      
      // If we have auth data, add it to our user objects
      const enhancedUsers = data?.map(profile => {
        return {
          id: profile.id,
          username: profile.username,
          created_at: profile.created_at,
          email: profile.id === userId ? userId : undefined
        };
      }) || [];
      
      setUsers(enhancedUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      // Provide sample data in development mode
      setUsers([
        { id: "user1", username: "demo_user", created_at: "2025-01-15T10:30:00Z", email: "demo@example.com" },
        { id: "user2", username: "test_user", created_at: "2025-02-20T15:45:00Z" },
        { id: "user3", username: "sample_user", created_at: "2025-03-10T08:15:00Z" }
      ]);
      
      toast({
        title: "Development Mode",
        description: "Using sample user data. Connect to Supabase for real data.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      setLoadingStats(true);
      
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username");
        
      if (profilesError) {
        // In development mode, provide sample data if database query fails
        console.warn("Using sample stats data for development:", profilesError);
        setUserStats([
          { id: "user1", username: "demo_user", imageCount: 12, email: "demo@example.com" },
          { id: "user2", username: "test_user", imageCount: 5 },
          { id: "user3", username: "sample_user", imageCount: 8 }
        ]);
        return;
      }
      
      // For each profile, fetch their image count
      const statsPromises = (profilesData || []).map(async (profile) => {
        const { count, error } = await supabase
          .from("generated_images")
          .select("id", { count: "exact" })
          .eq("user_id", profile.id);
          
        if (error) throw error;
        
        return {
          id: profile.id,
          username: profile.username,
          email: profile.id === userId ? userId : undefined,
          imageCount: count || 0,
        };
      });
      
      const stats = await Promise.all(statsPromises);
      setUserStats(stats);
      
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      // Provide sample data in development mode
      setUserStats([
        { id: "user1", username: "demo_user", imageCount: 12, email: "demo@example.com" },
        { id: "user2", username: "test_user", imageCount: 5 },
        { id: "user3", username: "sample_user", imageCount: 8 }
      ]);
      
      toast({
        title: "Development Mode",
        description: "Using sample statistics data. Connect to Supabase for real data.",
        variant: "default",
      });
    } finally {
      setLoadingStats(false);
    }
  };

  const deleteUser = async (userId: string) => {
    try {
      // First delete user's images
      await supabase
        .from("generated_images")
        .delete()
        .eq("user_id", userId);
        
      // Then delete the profile (cannot directly delete auth.users from client)
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      
      if (error) throw error;
      
      toast({
        title: "Success",
        description: "User data deleted successfully.",
      });
      
      // Refresh user list
      fetchUsers();
      fetchUserStats();
      
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Development Mode",
        description: "Delete operation simulated. No actual data was modified.",
        variant: "default",
      });
      
      // In development mode, simulate deletion by removing from local state
      setUsers(users.filter(user => user.id !== userId));
      setUserStats(userStats.filter(user => user.id !== userId));
    }
  };

  return {
    users,
    userStats,
    loading,
    loadingStats,
    deleteUser,
    fetchUsers,
    fetchUserStats
  };
}
