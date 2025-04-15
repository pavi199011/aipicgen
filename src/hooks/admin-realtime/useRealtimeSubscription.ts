
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type SubscriptionCallback = () => void;

export function useRealtimeSubscription(onDataChange: SubscriptionCallback) {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const { toast } = useToast();

  // Set up realtime subscriptions
  useEffect(() => {
    console.log("Setting up realtime admin dashboard subscriptions");
    
    // Create channel for realtime subscriptions
    const channel = supabase
      .channel('admin-dashboard-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'profiles' },
        async (payload) => {
          console.log('Profile change received in admin dashboard:', payload);
          
          // When profile changes, refresh all data
          onDataChange();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New User Detected',
              description: `User profile for ${payload.new.username || 'New User'} has been created.`,
            });
          }
        }
      )
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'generated_images' },
        (payload) => {
          console.log('Generated image change detected in admin dashboard:', payload);
          
          // Update stats when a new image is created or deleted
          onDataChange();
          
          if (payload.eventType === 'INSERT') {
            toast({
              title: 'New Image Created',
              description: 'A user has generated a new image.',
            });
          }
        }
      )
      .subscribe(status => {
        console.log('Admin dashboard realtime subscription status:', status);
        setIsSubscribed(status === 'SUBSCRIBED');
        
        if (status === 'SUBSCRIBED') {
          // Immediately fetch data when subscription is active
          toast({
            title: 'Real-time Updates Active',
            description: 'Admin dashboard will update automatically when changes occur.',
          });
          onDataChange();
        }
      });
    
    // Cleanup function to remove the channel
    return () => {
      console.log("Cleaning up realtime admin dashboard subscription");
      supabase.removeChannel(channel);
    };
  }, [onDataChange, toast]);

  return { isSubscribed };
}
