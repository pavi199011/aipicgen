
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserStats } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export function useRealtimeUserStats() {
  const [realtimeStats, setRealtimeStats] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Function to fetch user statistics
  const fetchUserStats = useCallback(async (users: User[]) => {
    try {
      setLoading(true);
      console.log("Fetching statistics for users...");
      
      if (!users || users.length === 0) {
        console.log("No users to fetch stats for");
        setRealtimeStats([]);
        setLoading(false);
        return;
      }
      
      // Fetch image counts for each user
      const statsPromises = users.map(async (user) => {
        const { count, error } = await supabase
          .from("generated_images")
          .select("id", { count: "exact" })
          .eq("user_id", user.id);
          
        if (error) {
          console.error(`Error fetching image count for user ${user.id}:`, error);
          return {
            id: user.id,
            username: user.username || '',
            email: user.email || '',
            imageCount: 0
          };
        }
        
        return {
          id: user.id,
          username: user.username || '',
          email: user.email || '',
          imageCount: count || 0
        };
      });
      
      const stats = await Promise.all(statsPromises);
      console.log("User statistics fetched successfully:", stats);
      setRealtimeStats(stats);
      
    } catch (error) {
      console.error("Error in fetchUserStats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user statistics. Please try again.",
        variant: "destructive",
      });
      setRealtimeStats([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    realtimeStats,
    loading,
    fetchUserStats
  };
}
