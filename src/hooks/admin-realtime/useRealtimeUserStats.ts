
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, UserStats } from '@/types/admin';

export function useRealtimeUserStats() {
  const [realtimeStats, setRealtimeStats] = useState<UserStats[]>([]);

  // Function to fetch user statistics
  const fetchUserStats = async (users: User[]) => {
    try {
      if (!users.length) return;
      
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
      setRealtimeStats(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
  };

  return {
    realtimeStats,
    fetchUserStats
  };
}
