
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
      
      // Check if the profiles table has the columns we need
      const { data: tableInfo, error: tableError } = await supabase
        .from('information_schema.columns')
        .select('column_name')
        .eq('table_name', 'profiles')
        .eq('table_schema', 'public');
        
      if (tableError) {
        console.error("Error checking profiles table schema:", tableError);
        throw new Error("Could not verify table structure");
      }
      
      const columnsExist = tableInfo?.reduce((acc: {[key: string]: boolean}, col) => {
        if (col.column_name) {
          acc[col.column_name] = true;
        }
        return acc;
      }, {}) || {};
      
      console.log("Available columns in profiles table:", columnsExist);
      
      // Dynamically build the select query based on available columns
      let selectQuery = "id";
      if (columnsExist.username) selectQuery += ", username";
      if (columnsExist.full_name) selectQuery += ", full_name";
      if (columnsExist.email) selectQuery += ", email";
      if (columnsExist.created_at) selectQuery += ", created_at";
      
      // Fetch profiles with enhanced data
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select(selectQuery);
      
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

      // Map profiles to user format, safely accessing properties
      const mappedUsers = profiles.map(profile => {
        return {
          id: profile.id,
          email: profile.email || `user-${profile.id.substring(0, 8)}@example.com`,
          username: profile.username || `user-${profile.id.substring(0, 8)}`,
          full_name: profile.full_name || '',
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
      // Set empty array on error
      setUsers([]);
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
