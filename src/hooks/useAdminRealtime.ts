
import { useCallback, useEffect, useState } from 'react';
import { useRealtimeUserData } from './admin-realtime/useRealtimeUserData';
import { useRealtimeUserStats } from './admin-realtime/useRealtimeUserStats';
import { useRealtimeSubscription } from './admin-realtime/useRealtimeSubscription';
import { useToast } from './use-toast';
import { User } from '@/types/admin';
import { supabase } from '@/integrations/supabase/client';

export function useAdminRealtime() {
  const { realtimeUsers, fetchUserData } = useRealtimeUserData();
  const { realtimeStats, fetchUserStats } = useRealtimeUserStats();
  const { toast } = useToast();
  const [manualRefreshCounter, setManualRefreshCounter] = useState(0);

  // Create a callback function that fetches both user data and stats
  const fetchAllData = useCallback(async () => {
    console.log("Fetching all real-time data...");
    try {
      // First, perform a direct query to check connection
      const { data: profilesCheck, error: profilesError } = await supabase
        .from('profiles')
        .select('id')
        .limit(1);
        
      if (profilesError) {
        console.error("Error checking profiles:", profilesError);
        throw profilesError;
      }
      
      console.log("Profiles check:", profilesCheck);
        
      // Now fetch the user data
      await fetchUserData();
      
      // After user data is fetched, get stats for those users
      if (realtimeUsers.length > 0) {
        await fetchUserStats(realtimeUsers);
      }
      
      console.log("Real-time data refreshed successfully");
      toast({
        title: "Data Refreshed",
        description: `Loaded ${realtimeUsers.length} users`,
        variant: "default",
      });
      
      // Increment the refresh counter to trigger dependent effects
      setManualRefreshCounter(prev => prev + 1);
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
    console.log("Initial data fetch for real-time data");
    fetchAllData();
    
    // Set up a refresh interval for testing
    const intervalId = setInterval(() => {
      console.log("Interval refresh triggered");
      fetchAllData();
    }, 30000); // Refresh every 30 seconds
    
    return () => clearInterval(intervalId);
  }, [fetchAllData]);

  return {
    realtimeUsers,
    realtimeStats,
    isSubscribed,
    fetchAllData,
    manualRefreshCounter
  };
}
