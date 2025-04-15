
import { useState, useCallback, useEffect } from 'react';
import { useRealtimeUserData } from './admin-realtime/useRealtimeUserData';
import { useRealtimeUserStats } from './admin-realtime/useRealtimeUserStats';
import { useToast } from './use-toast';
import { User, UserStats } from '@/types/admin';

export function useAdminRealtime() {
  const { users, loading: usersLoading, fetchUserData } = useRealtimeUserData();
  const { realtimeStats, loading: statsLoading, fetchUserStats } = useRealtimeUserStats();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { toast } = useToast();

  // Create a callback function that fetches both user data and stats
  const fetchAllData = useCallback(async () => {
    setIsRefreshing(true);
    console.log("Fetching admin dashboard data...");
    try {
      // Fetch the user data first
      await fetchUserData();
      
      // Wait for users to be available before fetching stats
      if (users.length > 0) {
        await fetchUserStats(users);
      }
      
      toast({
        title: "Success",
        description: "Dashboard data refreshed successfully.",
      });
      
    } catch (error) {
      console.error("Error refreshing admin data:", error);
      toast({
        title: "Error",
        description: "Failed to fetch dashboard data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
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
    loading: usersLoading || statsLoading || isRefreshing,
    fetchAllData
  };
}
