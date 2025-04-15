
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
    console.log("Fetching all admin data...");
    try {
      // Fetch the user data
      await fetchUserData();
      
      // After user data is fetched, get stats for those users
      if (users.length > 0) {
        await fetchUserStats(users);
      }
      
      console.log("Admin data refreshed successfully");
      
    } catch (error) {
      console.error("Error refreshing admin data:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh dashboard data. Please try again.",
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
