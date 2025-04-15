
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
      console.log("Fetching real user data from auth.users...");
      
      // Use a slight delay to ensure auth is properly initialized
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Fetch auth users
      const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers();
        
      if (authError) {
        console.error("Error fetching auth users:", authError);
        throw authError;
      }
      
      console.log("Auth users data:", authUsers);
      
      // Get all profiles to join with auth users
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (profilesError) {
        console.error("Error fetching user profiles:", profilesError);
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
          is_suspended: authUser.banned || false
        };
      });
      
      setUsers(users);
      console.log("Real user data loaded:", users);
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
        
      // Then delete the auth user (this will cascade to the profile)
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) {
        console.error("Error deleting auth user:", authError);
        throw authError;
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
