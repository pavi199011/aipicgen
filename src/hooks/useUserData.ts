
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
      
      // Fetch users from profiles table
      const { data: profiles, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (profilesError) {
        console.warn("Error fetching user profiles:", profilesError.message);
        throw profilesError;
      }
      
      // Map profiles to users
      const enhancedUsers = profiles.map(profile => {
        return {
          id: profile.id,
          username: profile.username || 'No Username',
          created_at: profile.created_at,
          email: `${profile.username || 'user'}@example.com` // Placeholder for email
        };
      });
      
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
      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);
      
      if (error) throw error;
      
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username
          }
        }
      });
      
      if (error) throw error;
      
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
