
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
        console.warn("Using sample stats data for development:", profilesError);
        // Sample user stats for development
        const sampleStats = [
          { id: "user1", username: "demo_user", email: "demo@example.com", imageCount: 12 },
          { id: "user2", username: "test_user", email: "test@example.com", imageCount: 5 },
          { id: "user3", username: "sample_user", email: "sample@example.com", imageCount: 8 },
          { id: "user4", username: "alex_dev", email: "alex@example.com", imageCount: 15 },
          { id: "user5", username: "sarah_admin", email: "sarah@example.com", imageCount: 7 },
          { id: "user6", username: "james_designer", email: "james@example.com", imageCount: 22 }
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
          
        if (error) {
          console.error("Error fetching image count:", error);
          return {
            id: profile.id,
            username: profile.username,
            email: profile.id === userId ? userId : undefined,
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
      // Provide sample data in development mode
      const sampleStats = [
        { id: "user1", username: "demo_user", email: "demo@example.com", imageCount: 12 },
        { id: "user2", username: "test_user", email: "test@example.com", imageCount: 5 },
        { id: "user3", username: "sample_user", email: "sample@example.com", imageCount: 8 },
        { id: "user4", username: "alex_dev", email: "alex@example.com", imageCount: 15 },
        { id: "user5", username: "sarah_admin", email: "sarah@example.com", imageCount: 7 },
        { id: "user6", username: "james_designer", email: "james@example.com", imageCount: 22 }
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
