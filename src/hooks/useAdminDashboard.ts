
import { useState, useEffect } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const { adminAuthenticated, adminLogout } = useAdminAuth();
  const { toast } = useToast();

  useEffect(() => {
    console.log("Admin authenticated state in dashboard:", adminAuthenticated);
    // Only fetch data if the user is authenticated
    if (adminAuthenticated === true) {
      fetchUsers();
      fetchUserStats();
    }
  }, [adminAuthenticated]);

  const fetchUsers = async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoading(true);
      console.log("Fetching user data...");
      
      // Using a mock data approach since Supabase admin API calls are failing
      // This is a temporary solution until proper admin API access is configured
      const mockUsers = [
        {
          id: "user-1",
          email: "user1@example.com",
          username: "user1",
          created_at: new Date().toISOString(),
          is_suspended: false
        },
        {
          id: "user-2",
          email: "user2@example.com",
          username: "user2",
          created_at: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
          is_suspended: false
        },
        {
          id: "user-3",
          email: "user3@example.com",
          username: "user3",
          created_at: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
          is_suspended: true
        }
      ];
      
      setUsers(mockUsers);
      console.log("Mock user data loaded:", mockUsers.length, "users");
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
  };

  const fetchUserStats = async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoadingStats(true);
      console.log("Fetching user stats data...");
      
      // Using mock stats data since Supabase admin API calls are failing
      const mockStats = [
        {
          id: "user-1",
          username: "user1",
          email: "user1@example.com",
          imageCount: 12,
        },
        {
          id: "user-2",
          username: "user2",
          email: "user2@example.com",
          imageCount: 5,
        },
        {
          id: "user-3",
          username: "user3",
          email: "user3@example.com",
          imageCount: 8,
        }
      ];
      
      setUserStats(mockStats);
      console.log("Mock user stats loaded:", mockStats.length, "users");
      
    } catch (error) {
      console.error("Error in fetchUserStats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user statistics. Using sample data instead.",
        variant: "destructive",
      });
      
      // Set sample data if fetching fails
      setUserStats([
        {
          id: "sample-1",
          username: "sample_user",
          email: "sample@example.com",
          imageCount: 5,
        }
      ]);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Mocked delete operation
      setUsers(users.filter(user => user.id !== userId));
      setUserStats(userStats.filter(stat => stat.id !== userId));
      
      toast({
        title: "Success",
        description: "User deleted successfully (simulated)",
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

  const handleSignOut = () => {
    adminLogout();
    toast({
      title: "Signed Out",
      description: "You have been signed out of the admin portal",
    });
  };

  return {
    activeTab,
    setActiveTab,
    users,
    userStats,
    loading,
    loadingStats,
    handleDeleteUser,
    handleSignOut,
    totalUsers: users.length,
    totalImages: userStats.reduce((sum, user) => sum + user.imageCount, 0),
    avgImagesPerUser: users.length > 0 
      ? (userStats.reduce((sum, user) => sum + user.imageCount, 0) / users.length).toFixed(1) 
      : "0.0",
    adminAuthenticated,
    fetchUsers,
    fetchUserStats
  };
}
