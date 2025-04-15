
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@/types/admin';

export function useRealtimeUserData() {
  const [realtimeUsers, setRealtimeUsers] = useState<User[]>([]);

  // Function to fetch all users
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
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  return {
    realtimeUsers,
    fetchUserData
  };
}
