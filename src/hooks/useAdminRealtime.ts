
import { useCallback, useEffect } from 'react';
import { useRealtimeUserData } from './admin-realtime/useRealtimeUserData';
import { useRealtimeUserStats } from './admin-realtime/useRealtimeUserStats';
import { useToast } from './use-toast';

export function useAdminRealtime() {
  const { users, fetchUserData } = useRealtimeUserData();
  const { realtimeStats, fetchUserStats } = useRealtimeUserStats();
  const { toast } = useToast();

  // Create a callback function that fetches both user data and stats
  const fetchAllData = useCallback(async () => {
    console.log("Fetching admin dashboard data...");
    try {
      // Fetch the user data first
      await fetchUserData();
      
      // After user data is fetched, get stats for those users
      await fetchUserStats(users);
      
    } catch (error) {
      console.error("Error refreshing admin data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchUserData, fetchUserStats, users, toast]);

  // Initial data fetch when the hook mounts
  useEffect(() => {
    console.log("Initial data fetch for admin dashboard");
    fetchAllData();
  }, [fetchAllData]);

  return {
    users,
    realtimeStats,
    fetchAllData
  };
}
