
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/admin";
import { supabase } from "@/integrations/supabase/client";
import { ADMIN_CREDENTIALS } from "@/components/admin/AdminConstants";

/**
 * Hook for managing user data in the admin dashboard
 */
export function useAdminUserData(
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setLoading: (loading: boolean) => void,
  adminAuthenticated: boolean | undefined
) {
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoading(true);
      console.log("Fetching user profiles...");
      
      // Use a slight delay to ensure auth is properly initialized
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Fetch profiles directly since we can't access auth.users due to permission issues
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (profilesError) {
        console.error("Error fetching user profiles:", profilesError);
        throw profilesError;
      }
      
      console.log("Profiles data:", profiles);
      
      if (!profiles || profiles.length === 0) {
        console.log("No profiles found");
        setUsers([]);
        setLoading(false);
        return;
      }
      
      // Map profiles to our user format
      const mappedUsers = profiles.map(profile => {
        return {
          id: profile.id,
          email: `user-${profile.id.substring(0, 8)}@example.com`, // Placeholder email
          username: profile.username || `user-${profile.id.substring(0, 8)}`,
          created_at: profile.created_at || new Date().toISOString(),
          is_suspended: false
        };
      });
      
      setUsers(mappedUsers);
      console.log("User data loaded:", mappedUsers);
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Please try again later.",
        variant: "destructive",
      });
      
      // Set empty data if fetching fails
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [adminAuthenticated, setLoading, setUsers, toast]);

  const handleDeleteUser = async (userId: string) => {
    try {
      // First delete user's images
      await supabase
        .from("generated_images")
        .delete()
        .eq("user_id", userId);
        
      // Then delete the profile
      const { error: profileError } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
        
      if (profileError) {
        console.error("Error deleting profile:", profileError);
        throw profileError;
      }
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      
      // Refetch the users to update the list
      fetchUsers();
    } catch (error: any) {
      console.error("Error in handleDeleteUser:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. Try again later.",
        variant: "destructive",
      });
    }
  };

  return {
    fetchUsers,
    handleDeleteUser
  };
}
