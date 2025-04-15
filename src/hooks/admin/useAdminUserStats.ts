
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserStats } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook for managing user statistics in the admin dashboard
 */
export function useAdminUserStats(
  users: User[],
  setUserStats: React.Dispatch<React.SetStateAction<UserStats[]>>,
  setLoadingStats: (loading: boolean) => void,
  adminAuthenticated: boolean | undefined
) {
  const { toast } = useToast();

  const fetchUserStats = useCallback(async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoadingStats(true);
      console.log("Fetching real user stats data...");
      
      if (users.length === 0) {
        console.log("No users to fetch stats for");
        setUserStats([]);
        return;
      }
      
      // Get image counts for each user
      const statsPromises = users.map(async (user) => {
        const { count, error } = await supabase
          .from("generated_images")
          .select("id", { count: "exact" })
          .eq("user_id", user.id);
          
        if (error) {
          console.error("Error fetching image count:", error);
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
      });
      
      const stats = await Promise.all(statsPromises);
      setUserStats(stats);
      console.log("Real user stats loaded:", stats);
    } catch (error) {
      console.error("Error in fetchUserStats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user statistics. Please try again later.",
        variant: "destructive",
      });
      
      // Set empty stats if fetching fails
      setUserStats([]);
    } finally {
      setLoadingStats(false);
    }
  }, [users, adminAuthenticated, setUserStats, setLoadingStats, toast]);

  // Calculate statistics
  const calculateStats = (users: User[], userStats: UserStats[]) => {
    return {
      totalUsers: users.length,
      totalImages: userStats.reduce((sum, user) => sum + user.imageCount, 0),
      avgImagesPerUser: users.length > 0 
        ? (userStats.reduce((sum, user) => sum + user.imageCount, 0) / users.length).toFixed(1) 
        : "0.0",
    };
  };

  return {
    fetchUserStats,
    calculateStats
  };
}
