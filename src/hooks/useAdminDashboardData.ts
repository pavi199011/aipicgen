
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useAdminData } from "@/hooks/useAdminData";
import { ADMIN_ROUTE } from "@/components/admin/AdminConstants";
import { supabase } from "@/integrations/supabase/client";

export function useAdminDashboardData() {
  const [currentTab, setCurrentTab] = useState("dashboard");
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | undefined>(undefined);
  const navigate = useNavigate();
  const location = useLocation();
  const { adminAuthenticated, adminLogout, loading: authLoading } = useAdminAuth();
  
  console.log("useAdminDashboardData - authenticated:", adminAuthenticated, "loading:", authLoading, "path:", location.pathname);
  
  // Get current user ID when authenticated
  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setCurrentUserId(session.user.id);
      }
    };
    
    if (adminAuthenticated) {
      getCurrentUser();
    }
  }, [adminAuthenticated]);
  
  const {
    users,
    userStats,
    loading,
    loadingStats,
    deleteUser,
    fetchUsers,
    fetchUserStats,
    addAdmin,
    createUser
  } = useAdminData(currentUserId);
  
  // Check if user is authenticated
  useEffect(() => {
    console.log("Authentication check in useAdminDashboardData:", adminAuthenticated, "auth loading:", authLoading);
    
    // Only redirect when auth is not loading and user is not authenticated
    if (!authLoading && !adminAuthenticated) {
      console.log("Not authenticated, redirecting to login");
      navigate(`/${ADMIN_ROUTE}/login`);
    } else if (!authLoading && adminAuthenticated) {
      console.log("Admin is authenticated, loading data");
      setIsLoading(false);
      
      // Fetch data when authenticated
      fetchUsers();
      fetchUserStats();
    }
  }, [adminAuthenticated, authLoading, navigate, fetchUsers, fetchUserStats]);
  
  // Parse hash from URL for tab selection
  useEffect(() => {
    const hash = location.hash.replace('#', '') || "dashboard";
    if (hash !== currentTab) {
      setCurrentTab(hash);
    }
  }, [location.hash, currentTab]);

  const handleSignOut = async (): Promise<void> => {
    adminLogout();
    navigate(`/${ADMIN_ROUTE}/login`);
    return Promise.resolve();
  };

  return {
    currentTab,
    setCurrentTab,
    isLoading,
    authLoading,
    adminAuthenticated,
    users,
    userStats,
    loading,
    loadingStats,
    deleteUser,
    fetchUsers,
    fetchUserStats,
    addAdmin,
    createUser,
    handleSignOut,
  };
}
