
import { useCallback, useEffect } from 'react';
import { useRealtimeUserData } from './admin-realtime/useRealtimeUserData';
import { useRealtimeUserStats } from './admin-realtime/useRealtimeUserStats';
import { useRealtimeSubscription } from './admin-realtime/useRealtimeSubscription';
import { useToast } from './use-toast';

export function useAdminRealtime() {
  const { realtimeUsers, fetchUserData } = useRealtimeUserData();
  const { realtimeStats, fetchUserStats } = useRealtimeUserStats();
  const { toast } = useToast();

  // Create a callback function that fetches both user data and stats
  const fetchAllData = useCallback(async () => {
    try {
      await fetchUserData();
      // After user data is fetched, get stats for those users
      if (realtimeUsers.length > 0) {
        await fetchUserStats(realtimeUsers);
      }
      console.log("Real-time data refreshed successfully");
    } catch (error) {
      console.error("Error refreshing real-time data:", error);
      toast({
        title: "Refresh Failed",
        description: "Could not refresh dashboard data. Please try again.",
        variant: "destructive",
      });
    }
  }, [fetchUserData, fetchUserStats, realtimeUsers, toast]);

  // Set up the real-time subscription with our combined fetch function
  const { isSubscribed } = useRealtimeSubscription(fetchAllData);

  // Initial data fetch when the hook mounts
  useEffect(() => {
    fetchAllData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    realtimeUsers,
    realtimeStats,
    isSubscribed,
    fetchAllData
  };
}
