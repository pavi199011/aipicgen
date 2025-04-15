
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
      
      // Use the service role client to access auth.users
      const { data, error } = await supabase.auth.admin.listUsers();
      
      if (error) {
        console.error("Error fetching auth users:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please check your permissions.",
          variant: "destructive",
        });
        return;
      }
      
      console.log("Fetched auth users successfully:", data);
      
      if (!data || !data.users || data.users.length === 0) {
        console.log("No users found");
        setUsers([]);
        return;
      }

      // Also fetch profiles to get usernames
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, created_at");
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
      }
      
      const profilesMap = new Map();
      if (profiles) {
        profiles.forEach(profile => {
          profilesMap.set(profile.id, profile);
        });
      }

      // Map auth users to our User format
      const mappedUsers = data.users.map(authUser => {
        const profile = profilesMap.get(authUser.id);
        return {
          id: authUser.id,
          email: authUser.email,
          username: profile?.username || authUser.email?.split('@')[0] || 'No Username',
          created_at: authUser.created_at || new Date().toISOString(),
          is_suspended: authUser.banned || false
        };
      });
      
      console.log("Mapped users from auth:", mappedUsers);
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
