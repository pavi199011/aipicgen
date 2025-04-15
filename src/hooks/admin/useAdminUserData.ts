
import { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { User, UserStats } from "@/types/admin";

// Generate stable mock users that don't change on every render
const generateMockUsers = (): User[] => {
  // Check if we already have stored mock users
  const storedUsers = localStorage.getItem('admin_mock_users');
  if (storedUsers) {
    return JSON.parse(storedUsers);
  }
  
  // Create new mock users with fixed dates
  const mockUsers = [
    {
      id: "mock-user-1",
      email: "user1@example.com",
      username: "user_one",
      created_at: new Date(2025, 3, 10).toISOString(),
      is_suspended: false
    },
    {
      id: "mock-user-2",
      email: "user2@example.com",
      username: "user_two",
      created_at: new Date(2025, 3, 12).toISOString(),
      is_suspended: false
    },
    {
      id: "mock-user-3",
      email: "user3@example.com",
      username: "user_three",
      created_at: new Date(2025, 3, 14).toISOString(),
      is_suspended: true
    }
  ];
  
  // Store the generated users
  localStorage.setItem('admin_mock_users', JSON.stringify(mockUsers));
  return mockUsers;
};

/**
 * Hook for managing mock user data in the admin dashboard
 */
export function useAdminUserData(
  setUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setLoading: (loading: boolean) => void,
  adminAuthenticated: boolean | undefined
) {
  const { toast } = useToast();
  const [mockUsersCache, setMockUsersCache] = useState<User[]>([]);

  // Initialize mock users once
  useEffect(() => {
    setMockUsersCache(generateMockUsers());
  }, []);

  const fetchUsers = useCallback(async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoading(true);
      console.log("Fetching user data...");
      
      // Use cached mock data
      setUsers(mockUsersCache);
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
  }, [adminAuthenticated, setLoading, setUsers, toast, mockUsersCache]);

  const handleDeleteUser = async (userId: string) => {
    try {
      // Update both the local cache and state
      const updatedUsers = mockUsersCache.filter(user => user.id !== userId);
      setMockUsersCache(updatedUsers);
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId));
      
      // Update localStorage
      localStorage.setItem('admin_mock_users', JSON.stringify(updatedUsers));
      
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
