
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type SubscriptionCallback = () => void;

export function useRealtimeSubscription(onDataChange: SubscriptionCallback) {
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
          
          // When profile changes, refresh all data
          onDataChange();
          
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
          onDataChange();
        }
      )
      .subscribe(status => {
        console.log('Realtime subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          // Immediately fetch data when subscription is active
          onDataChange();
        }
      });
    
    // Cleanup function to remove the channel
    return () => {
      supabase.removeChannel(channel);
    };
  }, [onDataChange, toast]);

  return { isSubscribed };
}
