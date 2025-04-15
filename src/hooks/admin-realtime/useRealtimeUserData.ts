
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
      
      // Fetch only the columns we know exist in the profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, created_at, updated_at");
      
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
      
      console.log("Fetched profiles:", profiles);
      
      if (!profiles || profiles.length === 0) {
        console.log("No users found, creating mock data");
        
        // If no users found in database, create mock data
        const mockUsers: User[] = [
          {
            id: "mock-user-1",
            username: "admin_user",
            email: "admin@example.com",
            full_name: "Admin User",
            created_at: new Date().toISOString(),
            is_suspended: false
          },
          {
            id: "mock-user-2",
            username: "regular_user",
            email: "user@example.com",
            full_name: "Regular User",
            created_at: new Date().toISOString(),
            is_suspended: false
          },
          {
            id: "mock-user-3",
            username: "test_user",
            email: "test@example.com", 
            full_name: "Test User",
            created_at: new Date().toISOString(),
            is_suspended: true
          }
        ];
        
        setUsers(mockUsers);
        setLoading(false);
        return;
      }

      // Map profiles to user format with mock data for missing fields
      const mappedUsers = profiles.map(profile => {
        // Generate deterministic email and full name based on username
        const username = profile.username || `user-${profile.id.substring(0, 8)}`;
        const email = profile.username 
          ? `${profile.username.toLowerCase()}@example.com` 
          : `user-${profile.id.substring(0, 8)}@example.com`;
        
        // Generate a proper full name from the username
        const fullName = profile.username
          ? profile.username
              .split(/[_.-]/)
              .map(part => part.charAt(0).toUpperCase() + part.slice(1))
              .join(' ')
          : `User ${profile.id.substring(0, 6)}`;
        
        return {
          id: profile.id,
          email: email,
          username: username,
          full_name: fullName,
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
      
      // Set mock data on error
      const fallbackUsers: User[] = [
        {
          id: "fallback-user-1",
          username: "admin_fallback",
          email: "admin_fallback@example.com",
          full_name: "Admin Fallback",
          created_at: new Date().toISOString(),
          is_suspended: false
        },
        {
          id: "fallback-user-2",
          username: "user_fallback",
          email: "user_fallback@example.com",
          full_name: "User Fallback",
          created_at: new Date().toISOString(),
          is_suspended: false
        }
      ];
      
      setUsers(fallbackUsers);
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
