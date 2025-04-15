
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export function useRealtimeUserData() {
  const [realtimeUsers, setRealtimeUsers] = useState<User[]>([]);
  const { toast } = useToast();

  // Function to fetch all users
  const fetchUserData = async () => {
    try {
      console.log("Fetching realtime user data...");
      
      // For testing, directly fetch from profiles table instead of auth.users
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (error) {
        console.error("Error fetching profiles:", error);
        throw error;
      }
      
      console.log("Fetched profiles:", profiles);
      
      if (!profiles || profiles.length === 0) {
        console.log("No profiles found");
        return;
      }

      // Map profiles to our user format
      const users = profiles.map(profile => {
        return {
          id: profile.id,
          email: `user-${profile.id.substring(0, 6)}@example.com`, // Placeholder email
          username: profile.username || `user-${profile.id.substring(0, 6)}`,
          created_at: profile.created_at || new Date().toISOString(),
          is_suspended: false
        };
      });
      
      console.log("Mapped users from profiles:", users);
      setRealtimeUsers(users);
      
      // Show a toast notification
      if (users.length > 0) {
        toast({
          title: "Users Loaded",
          description: `Loaded ${users.length} users`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user data",
        variant: "destructive",
      });
    }
  };

  return {
    realtimeUsers,
    fetchUserData
  };
}
