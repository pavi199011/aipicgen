
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserStats } from "@/types/admin";

/**
 * Hook for managing mock user statistics in the admin dashboard
 */
export function useAdminUserStats(
  users: User[],
  setUserStats: (stats: UserStats[]) => void,
  setLoadingStats: (loading: boolean) => void,
  adminAuthenticated: boolean | undefined
) {
  const { toast } = useToast();

  const fetchUserStats = useCallback(async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoadingStats(true);
      console.log("Fetching user stats data...");
      
      // Generate mock stats based on users
      const mockStats = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        imageCount: Math.floor(Math.random() * 10), // Random count for sample data
      }));
      
      setUserStats(mockStats);
      console.log("Mock user stats loaded");
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
