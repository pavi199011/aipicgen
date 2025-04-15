
import { useState, useEffect } from "react";

/**
 * Hook that manages admin authentication state
 * Checks for existing authentication on mount
 */
export function useAdminAuthState() {
  const [loading, setLoading] = useState(true);
  const [adminAuthenticated, setAdminAuthenticated] = useState<boolean | undefined>(undefined);

  // Check for existing admin authentication on mount
  useEffect(() => {
    console.log("Checking admin authentication...");
    
    const checkAuth = () => {
      try {
        // Check local storage for authentication state
        const savedAuth = localStorage.getItem('adminAuthenticated');
        
        if (savedAuth === 'true') {
          console.log("Found existing admin authentication in local storage");
          setAdminAuthenticated(true);
        } else {
          console.log("No existing admin authentication found");
          setAdminAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking admin auth:", error);
        setAdminAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };
    
    // Check authentication immediately without delay
    checkAuth();
  }, []);

  return {
    loading,
    adminAuthenticated,
    setAdminAuthenticated
  };
}
