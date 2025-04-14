
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
      
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username");
        
      if (profilesError) {
        console.warn("Error fetching profiles:", profilesError);
        throw profilesError;
      }
      
      // For each profile, fetch their image count
      const statsPromises = (profilesData || []).map(async (profile) => {
        const { count, error } = await supabase
          .from("generated_images")
          .select("id", { count: "exact" })
          .eq("user_id", profile.id);
          
        if (error) {
          console.error("Error fetching image count:", error);
          return {
            id: profile.id,
            username: profile.username,
            imageCount: 0,
          };
        }
        
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
