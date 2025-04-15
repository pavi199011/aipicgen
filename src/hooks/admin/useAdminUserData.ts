
import { useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserStats } from "@/types/admin";

/**
 * Hook for managing mock user data in the admin dashboard
 */
export function useAdminUserData(
  setUsers: (users: User[]) => void,
  setLoading: (loading: boolean) => void,
  adminAuthenticated: boolean | undefined
) {
  const { toast } = useToast();

  const fetchUsers = useCallback(async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoading(true);
      console.log("Fetching user data...");
      
      // Use mock data since we don't have supabase admin access
      const mockUsers = [
        {
          id: "mock-user-1",
          email: "user1@example.com",
          username: "user_one",
          created_at: new Date().toISOString(),
          is_suspended: false
        },
        {
          id: "mock-user-2",
          email: "user2@example.com",
          username: "user_two",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          is_suspended: false
        },
        {
          id: "mock-user-3",
          email: "user3@example.com",
          username: "user_three",
          created_at: new Date(Date.now() - 172800000).toISOString(),
          is_suspended: true
        }
      ];
      
      setUsers(mockUsers);
      console.log("Mock user data loaded");
    } catch (error) {
      console.error("Error in fetchUsers:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users. Using sample data instead.",
        variant: "destructive",
      });
      
      // Set sample data if fetching fails
      setUsers([
        {
          id: "sample-1",
          email: "sample@example.com",
          username: "sample_user",
          created_at: new Date().toISOString(),
          is_suspended: false
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [adminAuthenticated, setLoading, setUsers, toast]);

  const handleDeleteUser = async (userId: string) => {
    try {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
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
