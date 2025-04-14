
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
        (payload) => {
          console.log('Profile change received:', payload);
          
          // Handle different event types
          if (payload.eventType === 'INSERT') {
            setRealtimeUsers(prev => [...prev, mapProfileToUser(payload.new)]);
            toast({
              title: 'New User',
              description: `User ${payload.new.username || 'Unknown'} has joined.`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setRealtimeUsers(prev => 
              prev.map(user => user.id === payload.new.id ? mapProfileToUser(payload.new) : user)
            );
          } else if (payload.eventType === 'DELETE') {
            setRealtimeUsers(prev => 
              prev.filter(user => user.id !== payload.old.id)
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
      });
    
    // Cleanup function to remove the channel
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast]);

  // Helper function to map a profile to a user
  const mapProfileToUser = (profile: any): User => {
    return {
      id: profile.id,
      username: profile.username || 'No Username',
      created_at: profile.created_at,
      email: profile.email
    };
  };

  // Function to fetch user stats
  const fetchUserStats = async () => {
    try {
      // Fetch profiles
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username');
      
      if (profilesError) throw profilesError;
      
      // Fetch image counts for each profile
      const statsPromises = (profiles || []).map(async (profile) => {
        const { count, error } = await supabase
          .from('generated_images')
          .select('id', { count: 'exact' })
          .eq('user_id', profile.id);
        
        if (error) {
          console.error('Error fetching image count:', error);
          return {
            id: profile.id,
            username: profile.username,
            imageCount: 0
          };
        }
        
        return {
          id: profile.id,
          username: profile.username,
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
