
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User, UserStats } from "@/types/admin";

export function useAdminData(userId: string | undefined) {
  const [users, setUsers] = useState<User[]>([]);
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const { toast } = useToast();

  // Making these callbacks so they can be dependencies in useEffect
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (error) {
        console.warn("Using sample data for development:", error);
        // Sample user data for development
        const sampleUsers = [
          { id: "user1", username: "demo_user", created_at: "2025-01-15T10:30:00Z", email: "demo@example.com" },
          { id: "user2", username: "test_user", created_at: "2025-02-20T15:45:00Z" },
          { id: "user3", username: "sample_user", created_at: "2025-03-10T08:15:00Z" },
          { id: "user4", username: "alex_dev", created_at: "2025-03-15T14:22:00Z" },
          { id: "user5", username: "sarah_admin", created_at: "2025-01-05T09:10:00Z" },
          { id: "user6", username: "james_designer", created_at: "2025-02-10T11:35:00Z" }
        ];
        setUsers(sampleUsers);
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
      const sampleUsers = [
        { id: "user1", username: "demo_user", created_at: "2025-01-15T10:30:00Z", email: "demo@example.com" },
        { id: "user2", username: "test_user", created_at: "2025-02-20T15:45:00Z" },
        { id: "user3", username: "sample_user", created_at: "2025-03-10T08:15:00Z" },
        { id: "user4", username: "alex_dev", created_at: "2025-03-15T14:22:00Z" },
        { id: "user5", username: "sarah_admin", created_at: "2025-01-05T09:10:00Z" },
        { id: "user6", username: "james_designer", created_at: "2025-02-10T11:35:00Z" }
      ];
      setUsers(sampleUsers);
      
      toast({
        title: "Development Mode",
        description: "Using sample user data. Connect to Supabase for real data.",
        variant: "default",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  const fetchUserStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      
      // Fetch profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username");
        
      if (profilesError) {
        console.warn("Using sample stats data for development:", profilesError);
        // Sample user stats for development
        const sampleStats = [
          { id: "user1", username: "demo_user", imageCount: 12, email: "demo@example.com" },
          { id: "user2", username: "test_user", imageCount: 5 },
          { id: "user3", username: "sample_user", imageCount: 8 },
          { id: "user4", username: "alex_dev", imageCount: 15 },
          { id: "user5", username: "sarah_admin", imageCount: 7 },
          { id: "user6", username: "james_designer", imageCount: 22 }
        ];
        setUserStats(sampleStats);
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
      const sampleStats = [
        { id: "user1", username: "demo_user", imageCount: 12, email: "demo@example.com" },
        { id: "user2", username: "test_user", imageCount: 5 },
        { id: "user3", username: "sample_user", imageCount: 8 },
        { id: "user4", username: "alex_dev", imageCount: 15 },
        { id: "user5", username: "sarah_admin", imageCount: 7 },
        { id: "user6", username: "james_designer", imageCount: 22 }
      ];
      setUserStats(sampleStats);
      
      toast({
        title: "Development Mode",
        description: "Using sample statistics data. Connect to Supabase for real data.",
        variant: "default",
      });
    } finally {
      setLoadingStats(false);
    }
  }, [userId, toast]);

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

  const addAdmin = async (email: string, password: string) => {
    try {
      // In a real app, this would create a new admin user in Supabase and assign admin role
      // For development, just simulate the action
      toast({
        title: "Development Mode",
        description: `Simulated adding ${email} as an admin. In production, this would create a user and assign admin role.`,
        variant: "default",
      });
      
      return Promise.resolve();
    } catch (error) {
      console.error("Error adding admin:", error);
      toast({
        title: "Error",
        description: "Failed to add admin. Please try again.",
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  // Initial data load
  useEffect(() => {
    fetchUsers();
    fetchUserStats();
  }, [fetchUsers, fetchUserStats]);

  return {
    users,
    userStats,
    loading,
    loadingStats,
    deleteUser,
    fetchUsers,
    fetchUserStats,
    addAdmin
  };
}
