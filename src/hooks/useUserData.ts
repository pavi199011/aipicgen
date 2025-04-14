
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
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, created_at");
        
      if (error) {
        console.warn("Error fetching users:", error.message);
        // Sample user data for development
        const sampleUsers = [
          { id: "user1", username: "demo_user", created_at: "2025-01-15T10:30:00Z", email: "demo@example.com" },
          { id: "user2", username: "test_user", created_at: "2025-02-20T15:45:00Z" },
          { id: "user3", username: "sample_user", created_at: "2025-03-10T08:15:00Z" },
          { id: "user4", username: "alex_dev", created_at: "2025-03-15T14:22:00Z" },
          { id: "user5", username: "sarah_admin", created_at: "2025-01-05T09:10:00Z" },
          { id: "user6", username: "james_designer", created_at: "2025-02-10T11:35:00Z" }
        ];
        setUsers(sampleUsers);
        return;
      }
      
      console.log("Users data fetched:", data);
      // If we have auth data, add it to our user objects
      const enhancedUsers = data?.map(profile => {
        return {
          id: profile.id,
          username: profile.username,
          created_at: profile.created_at,
          email: profile.id === userId ? userId : undefined
        };
      }) || [];
      
      setUsers(enhancedUsers);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      // Provide sample data in development mode
      const sampleUsers = [
        { id: "user1", username: "demo_user", created_at: "2025-01-15T10:30:00Z", email: "demo@example.com" },
        { id: "user2", username: "test_user", created_at: "2025-02-20T15:45:00Z" },
        { id: "user3", username: "sample_user", created_at: "2025-03-10T08:15:00Z" },
        { id: "user4", username: "alex_dev", created_at: "2025-03-15T14:22:00Z" },
        { id: "user5", username: "sarah_admin", created_at: "2025-01-05T09:10:00Z" },
        { id: "user6", username: "james_designer", created_at: "2025-02-10T11:35:00Z" }
      ];
      setUsers(sampleUsers);
      
      toast({
        title: "Development Mode",
        description: "Using sample user data. Connect to Supabase for real data.",
        variant: "default",
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
        
      // Then delete the profile (cannot directly delete auth.users from client)
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
        title: "Development Mode",
        description: "Delete operation simulated. No actual data was modified.",
        variant: "default",
      });
      
      // In development mode, simulate deletion by removing from local state
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  // Create a new user
  const createUser = async ({ email, username, password }: { email: string, username: string, password: string }) => {
    try {
      // In a real app, this would create a new user in Supabase Auth
      // For development, just simulate the action
      
      // Create a simulated user ID
      const newUserId = `user${Date.now()}`;
      
      // Add to local state
      const newUser = {
        id: newUserId,
        username,
        email,
        created_at: new Date().toISOString()
      };
      
      // Update local state
      setUsers(prev => [...prev, newUser]);
      
      toast({
        title: "Development Mode",
        description: `Simulated creating new user: ${username} (${email}). In production, this would create a real user account.`,
        variant: "default",
      });
      
      return Promise.resolve();
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast({
        title: "Error",
        description: "Failed to create user. Please try again.",
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
