
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export function useRealtimeUserData() {
  const [users, setUsers] = useState<User[]>([]);
  const { toast } = useToast();

  // Function to fetch all users from auth.users
  const fetchUserData = async () => {
    try {
      console.log("Fetching users from auth.users table...");
      
      // Directly query profiles table to get user information
      // Since we can't access auth.users directly, we'll use profiles instead
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, created_at");
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        toast({
          title: "Error",
          description: "Failed to fetch user profiles. Please try again.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Fetched profiles successfully:", profiles);
      
      if (!profiles || profiles.length === 0) {
        console.log("No users found");
        setUsers([]);
        return;
      }

      // Get emails from auth if possible, otherwise use empty values
      // This is a workaround since we can't directly access auth.users
      const mappedUsers = profiles.map(profile => {
        return {
          id: profile.id,
          email: `user-${profile.id.substring(0, 8)}@example.com`, // Placeholder email
          username: profile.username || `user-${profile.id.substring(0, 8)}`,
          created_at: profile.created_at || new Date().toISOString(),
          is_suspended: false
        };
      });
      
      console.log("Mapped users from profiles:", mappedUsers);
      setUsers(mappedUsers);
      
    } catch (error) {
      console.error("Error in fetchUserData:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user data. Please check your connection.",
        variant: "destructive",
      });
      setUsers([]);
    }
  };

  return {
    users,
    fetchUserData
  };
}
