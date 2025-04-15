
import { useCallback } from 'react';
import { useRealtimeUserData } from './admin-realtime/useRealtimeUserData';
import { useRealtimeUserStats } from './admin-realtime/useRealtimeUserStats';
import { useRealtimeSubscription } from './admin-realtime/useRealtimeSubscription';

export function useAdminRealtime() {
  const { realtimeUsers, fetchUserData } = useRealtimeUserData();
  const { realtimeStats, fetchUserStats } = useRealtimeUserStats();

  // Create a callback function that fetches both user data and stats
  const fetchAllData = useCallback(async () => {
    await fetchUserData();
    // After user data is fetched, get stats for those users
    if (realtimeUsers.length > 0) {
      await fetchUserStats(realtimeUsers);
    }
  }, [fetchUserData, fetchUserStats, realtimeUsers]);

  // Set up the real-time subscription with our combined fetch function
  const { isSubscribed } = useRealtimeSubscription(fetchAllData);

  return {
    realtimeUsers,
    realtimeStats,
    isSubscribed,
    fetchAllData
  };
}
