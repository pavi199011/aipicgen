
import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/admin';
import { useToast } from '@/hooks/use-toast';

export function useRealtimeUserData() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  // Function to fetch all users from profiles table
  const fetchUserData = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching users from profiles table...");
      
      // Fetch user profiles
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, created_at")
        .order('created_at', { ascending: false });
      
      if (profilesError) {
        console.error("Error fetching profiles:", profilesError);
        toast({
          title: "Error",
          description: "Failed to fetch user profiles. Please try again.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      console.log("Fetched profiles successfully:", profiles);
      
      if (!profiles || profiles.length === 0) {
        console.log("No users found");
        setUsers([]);
        setLoading(false);
        return;
      }

      // Map profiles to user format
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
    } finally {
      setLoading(false);
    }
  }, [toast]);

  return {
    users,
    loading: loading,
    fetchUserData
  };
}
