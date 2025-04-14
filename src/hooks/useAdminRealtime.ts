
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User, UserStats } from '@/types/admin';

export function useAdminRealtime() {
  const [realtimeUsers, setRealtimeUsers] = useState<User[]>([]);
  const [realtimeStats, setRealtimeStats] = useState<UserStats[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

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
          
          // Handle different event types
          if (payload.eventType === 'INSERT') {
            // Get email from auth for new user
            const { data: authData } = await supabase.auth.admin.getUserById(payload.new.id);
            
            const newUser = {
              id: payload.new.id,
              username: payload.new.username || 'No Username',
              created_at: payload.new.created_at || new Date().toISOString(),
              email: authData?.user?.email || `${payload.new.username || 'user'}@example.com`,
            };
            
            setRealtimeUsers(prev => [...prev, newUser]);
            
            // Also update stats
            const { count } = await supabase
              .from("generated_images")
              .select("id", { count: "exact" })
              .eq("user_id", payload.new.id);
              
            const newStat = {
              id: payload.new.id,
              username: payload.new.username || 'No Username',
              email: authData?.user?.email || `${payload.new.username || 'user'}@example.com`,
              imageCount: count || 0,
            };
            
            setRealtimeStats(prev => [...prev, newStat]);
            
            toast({
              title: 'New User',
              description: `User ${payload.new.username || 'Unknown'} has joined.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            // Get email from auth for updated user
            const { data: authData } = await supabase.auth.admin.getUserById(payload.new.id);
            
            const updatedUser = {
              id: payload.new.id,
              username: payload.new.username || 'No Username',
              created_at: payload.new.created_at || new Date().toISOString(),
              email: authData?.user?.email || `${payload.new.username || 'user'}@example.com`,
            };
            
            setRealtimeUsers(prev => 
              prev.map(user => user.id === payload.new.id ? updatedUser : user)
            );
            
            // Also update stats
            setRealtimeStats(prev => 
              prev.map(stat => {
                if (stat.id === payload.new.id) {
                  return {
                    ...stat,
                    username: payload.new.username || 'No Username',
                    email: authData?.user?.email || `${payload.new.username || 'user'}@example.com`,
                  };
                }
                return stat;
              })
            );
          } else if (payload.eventType === 'DELETE') {
            setRealtimeUsers(prev => 
              prev.filter(user => user.id !== payload.old.id)
            );
            
            setRealtimeStats(prev => 
              prev.filter(stat => stat.id !== payload.old.id)
            );
          }
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'generated_images' },
        (payload) => {
          console.log('Generated image change received:', payload);
          
          // Update stats when a new image is created or deleted
          if (payload.eventType === 'INSERT' || payload.eventType === 'DELETE') {
            // We need to refetch stats to get accurate counts
            fetchUserStats();
          }
        }
      )
      .subscribe(status => {
        console.log('Realtime subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          // Immediately fetch data when subscription is active
          fetchUserStats();
        }
      });
    
    // Cleanup function to remove the channel
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Function to fetch user stats
  const fetchUserStats = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username, created_at');
      
      if (profilesError) throw profilesError;
      
      // Fetch image counts for each profile and build users data
      const usersPromises = (profiles || []).map(async (profile) => {
        const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
        
        return {
          id: profile.id,
          username: profile.username || 'No Username', 
          email: authData?.user?.email || `${profile.username || 'user'}@example.com`,
          created_at: profile.created_at || new Date().toISOString(),
        };
      });
      
      const users = await Promise.all(usersPromises);
      setRealtimeUsers(users);
      
      // Fetch image counts for each profile and build stats
      const statsPromises = (profiles || []).map(async (profile) => {
        const { count, error } = await supabase
          .from('generated_images')
          .select('id', { count: 'exact' })
          .eq('user_id', profile.id);
        
        if (error) {
          console.error('Error fetching image count:', error);
          return {
            id: profile.id,
            username: profile.username || 'No Username',
            imageCount: 0
          };
        }
        
        const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
        
        return {
          id: profile.id,
          username: profile.username || 'No Username',
          email: authData?.user?.email || `${profile.username || 'user'}@example.com`,
          imageCount: count || 0
        };
      });
      
      const stats = await Promise.all(statsPromises);
      setRealtimeStats(stats);
      
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  return {
    realtimeUsers,
    realtimeStats,
    isSubscribed,
    fetchUserStats
  };
}
