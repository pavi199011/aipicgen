
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/types/admin";

export function useUserData(userId: string | undefined) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch users data
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      console.log("Fetching users...");
      
      // Fetch auth users with profiles joined
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (profilesError) {
        console.warn("Error fetching user profiles:", profilesError.message);
        throw profilesError;
      }
      
      // Map profiles to users with auth information
      const enhancedUsers = await Promise.all(
        (profiles || []).map(async (profile) => {
          // Try to get email from auth - this is only for admin display purposes
          const { data: authData } = await supabase.auth.admin.getUserById(profile.id);
          
          return {
            id: profile.id,
            username: profile.username || 'No Username',
            created_at: profile.created_at,
            email: authData?.user?.email || `${profile.username || 'user'}@example.com`,
          };
        })
      );
      
      console.log("Users data fetched:", enhancedUsers);
      setUsers(enhancedUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Check your connection.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [userId, toast]);

  // Delete user functionality
  const deleteUser = async (userId: string) => {
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
      
      if (profileError) throw profileError;
      
      // Finally delete the auth user
      const { error: authError } = await supabase.auth.admin.deleteUser(userId);
      
      if (authError) throw authError;
      
      toast({
        title: "Success",
        description: "User data deleted successfully.",
      });
      
      // Refresh user list
      fetchUsers();
      
    } catch (error: any) {
      console.error("Error deleting user:", error);
      toast({
        title: "Error",
        description: "Failed to delete user. " + error.message,
        variant: "destructive",
      });
    }
  };

  // Create a new user
  const createUser = async ({ email, username, password }: { email: string, username: string, password: string }) => {
    try {
      // Create the user with Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { username }
      });
      
      if (error) throw error;
      
      // Ensure the profile exists and has the correct username
      // This is a fallback in case the trigger doesn't work
      if (data?.user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .upsert({ 
            id: data.user.id, 
            username: username,
            updated_at: new Date().toISOString()
          }, { onConflict: 'id' });
          
        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Don't throw here, as the user is already created
        }
      }
      
      toast({
        title: "User Created",
        description: `User ${username} created successfully.`,
      });
      
      // Refresh user list
      fetchUsers();
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user: " + error.message,
        variant: "destructive",
      });
      return Promise.reject(error);
    }
  };

  // Initial data load
  useEffect(() => {
    console.log("Initial user data load triggered");
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    deleteUser,
    fetchUsers,
    createUser
  };
}
