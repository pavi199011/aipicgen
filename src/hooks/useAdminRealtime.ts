
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, UserStats } from '@/types/admin';

export function useAdminRealtime() {
  const [realtimeUsers, setRealtimeUsers] = useState<User[]>([]);
  const [realtimeStats, setRealtimeStats] = useState<UserStats[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  // Function to fetch all users and their stats
  const fetchUserData = async () => {
    try {
      // Fetch auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
      if (authError) {
        console.warn("Error fetching auth users:", authError.message);
        return;
      }
      
      // Get all profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (profilesError) {
        console.warn("Error fetching profiles:", profilesError.message);
      }
      
      const profilesMap = new Map();
      (profiles || []).forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
      
      // Map auth users to our user format
      const users = authUsers.users.map(authUser => {
        const profile = profilesMap.get(authUser.id);
        return {
          id: authUser.id,
          email: authUser.email,
          username: profile?.username || authUser.email?.split('@')[0] || 'No Username',
          created_at: authUser.created_at || new Date().toISOString(),
        };
      });
      
      setRealtimeUsers(users);
      
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
      console.error("Error fetching user data:", error);
    }
  };

  // Set up realtime subscriptions
  useEffect(() => {
    console.log("Setting up realtime subscriptions");
    
    // Create channel for realtime subscriptions
    const channel = supabase
      .channel('admin-dashboard-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async (payload) => {
          console.log('Profile change received:', payload);
          
          // When profile changes, refresh all data 
          // This is simpler than trying to update just the changed records
          fetchUserData();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'User Profile Created',
              description: `User profile for ${payload.new.username || 'Unknown'} has been created.`,
            });
          }
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'generated_images' },
        (payload) => {
          console.log('Generated image change received:', payload);
          
          // Update stats when a new image is created or deleted
          fetchUserData();
        }
      )
      .subscribe(status => {
        console.log('Realtime subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          // Immediately fetch data when subscription is active
          fetchUserData();
        }
      });
    
    // Cleanup function to remove the channel
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  return {
    realtimeUsers,
    realtimeStats,
    isSubscribed,
    fetchUserStats: fetchUserData
  };
}
