
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
        
      if (error) throw error;
      
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
      toast({
        title: "Error",
        description: "Could not fetch users. You may not have admin privileges.",
        variant: "destructive",
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
        
      if (profilesError) throw profilesError;
      
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
      toast({
        title: "Error",
        description: "Could not fetch user statistics.",
        variant: "destructive",
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
        description: "User data deleted successfully. Note: In this demo, the auth user remains.",
      });
      
      // Refresh user list
      fetchUsers();
      fetchUserStats();
      
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: error.message || "Could not delete user",
        variant: "destructive",
      });
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
