
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserStats } from "@/types/admin";

export function useUserStats(userId: string | undefined) {
  const [userStats, setUserStats] = useState<UserStats[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const { toast } = useToast();

  const fetchUserStats = useCallback(async () => {
    try {
      setLoadingStats(true);
      
      // Fetch auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
      if (authError) {
        console.warn("Error fetching auth users:", authError.message);
        throw authError;
      }
      
      // Get all profiles to join with auth users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username");
        
      if (profilesError) {
        console.warn("Error fetching user profiles:", profilesError.message);
      }
      
      const profilesMap = new Map();
      (profiles || []).forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
      // For each user, fetch their image count
      const statsPromises = authUsers.users.map(async (authUser) => {
        const profile = profilesMap.get(authUser.id);
        
        const { count, error } = await supabase
          .from("generated_images")
          .select("id", { count: "exact" })
          .eq("user_id", authUser.id);
          
        if (error) {
          console.error("Error fetching image count:", error);
          return {
            id: authUser.id,
            username: profile?.username || authUser.email?.split('@')[0] || 'No Username',
            email: authUser.email,
            imageCount: 0,
          };
        }
        
        return {
          id: authUser.id,
          username: profile?.username || authUser.email?.split('@')[0] || 'No Username',
          email: authUser.email,
          imageCount: count || 0,
        };
      });
      
      const stats = await Promise.all(statsPromises);
      setUserStats(stats);
      
    } catch (error: any) {
      console.error("Error fetching user stats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user statistics.",
        variant: "destructive",
      });
    } finally {
      setLoadingStats(false);
    }
  }, [userId, toast]);

  // Initial data load
  useEffect(() => {
    console.log("Initial stats data load triggered");
    fetchUserStats();
  }, [fetchUserStats]);

  return {
    userStats,
    loadingStats,
    fetchUserStats
  };
}
