
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserStats } from "@/types/admin";

// Generate stable user stats that don't change on every render
const generateMockStats = (users: User[]): UserStats[] => {
  // Check if we already have stored mock stats
  const storedStats = localStorage.getItem('admin_mock_stats');
  if (storedStats) {
    const parsedStats = JSON.parse(storedStats);
    
    // Check if we need to add stats for any new users
    const existingUserIds = parsedStats.map(stat => stat.id);
    const newUsers = users.filter(user => !existingUserIds.includes(user.id));
    
    if (newUsers.length > 0) {
      const newStats = [...parsedStats];
      
      // Add stats for new users
      newUsers.forEach((user, index) => {
        newStats.push({
          id: user.id,
          username: user.username,
          email: user.email,
          imageCount: 0, // Start with 0 images for new users
        });
      });
      
      // Store updated stats
      localStorage.setItem('admin_mock_stats', JSON.stringify(newStats));
      return newStats;
    }
    
    return parsedStats;
  }
  
  // Create new mock stats with fixed image counts
  const mockStats = users.map((user, index) => ({
    id: user.id,
    username: user.username,
    email: user.email,
    imageCount: (index + 1) * 5, // Predictable pattern: 5, 10, 15, etc.
  }));
  
  // Store the generated stats
  localStorage.setItem('admin_mock_stats', JSON.stringify(mockStats));
  return mockStats;
};

// Add a stat entry for a new user
export const addNewUserToMockStats = (userData: {
  id: string;
  username?: string;
  email?: string;
}): void => {
  const storedStats = localStorage.getItem('admin_mock_stats');
  let stats = storedStats ? JSON.parse(storedStats) : [];
  
  // Check if stats for this user already exist
  const exists = stats.some(stat => stat.id === userData.id);
  if (!exists) {
    stats.push({
      id: userData.id,
      username: userData.username,
      email: userData.email,
      imageCount: 0, // Start with 0 images for new users
    });
    localStorage.setItem('admin_mock_stats', JSON.stringify(stats));
  }
};

/**
 * Hook for managing mock user statistics in the admin dashboard
 */
export function useAdminUserStats(
  users: User[],
  setUserStats: React.Dispatch<React.SetStateAction<UserStats[]>>,
  setLoadingStats: (loading: boolean) => void,
  adminAuthenticated: boolean | undefined
) {
  const { toast } = useToast();
  const [mockStatsCache, setMockStatsCache] = useState<UserStats[]>([]);

  // Initialize mock stats when users change
  useEffect(() => {
    if (users.length > 0) {
      setMockStatsCache(generateMockStats(users));
    }
  }, [users]);

  const fetchUserStats = useCallback(async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoadingStats(true);
      console.log("Fetching user stats data...");
      
      // Use cached mock stats
      setUserStats(mockStatsCache);
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
        imageCount: 1, // Default value
      })));
    } finally {
      setLoadingStats(false);
    }
  }, [users, adminAuthenticated, setUserStats, setLoadingStats, toast, mockStatsCache]);

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
