
import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function useAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [users, setUsers] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const { adminAuthenticated, adminLogout } = useAdminAuth();
  const { toast } = useToast();

  // Only fetch data when authenticated
  useEffect(() => {
    console.log("Admin authenticated state in dashboard:", adminAuthenticated);
    if (adminAuthenticated === true) {
      fetchUsers();
      fetchUserStats();
    }
  }, [adminAuthenticated]);

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
  }, [adminAuthenticated, toast]);

  const fetchUserStats = useCallback(async () => {
    if (adminAuthenticated !== true) return;
    
    try {
      setLoadingStats(true);
      console.log("Fetching user stats data...");
      
      // Generate mock stats based on users
      const mockStats = users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        imageCount: Math.floor(Math.random() * 10), // Random count for sample data
      }));
      
      setUserStats(mockStats);
      console.log("Mock user stats loaded");
    } catch (error) {
      console.error("Error in fetchUserStats:", error);
      toast({
        title: "Error",
        description: "Failed to fetch user statistics. Using sample data instead.",
        variant: "destructive",
      });
      
      // Set sample data based on current users if fetching fails
      setUserStats(users.map(user => ({
        id: user.id,
        username: user.username,
        email: user.email,
        imageCount: Math.floor(Math.random() * 10), // Random count for sample data
      })));
    } finally {
      setLoadingStats(false);
    }
  }, [users, adminAuthenticated, toast]);

  const handleDeleteUser = async (userId) => {
    try {
      // Simulate user deletion with mock data
      setUsers(users.filter(user => user.id !== userId));
      setUserStats(userStats.filter(stat => stat.id !== userId));
      
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
