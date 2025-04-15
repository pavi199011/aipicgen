
import { useAdminAuthState } from "./admin/useAdminAuthState";
import { useAdminAuthMethods } from "./admin/useAdminAuthMethods";
import { AdminCredentials } from "@/types/admin";

/**
 * Main hook for admin authentication
 * Combines state and methods from specialized hooks
 */
export function useAdminAuth() {
  const { loading: stateLoading, adminAuthenticated, setAdminAuthenticated } = useAdminAuthState();
  const { loading: methodsLoading, adminLogin, adminLogout } = useAdminAuthMethods(setAdminAuthenticated);

  // Combine loading states
  const loading = stateLoading || methodsLoading;

  return {
    loading,
    adminAuthenticated,
    adminLogin,
    adminLogout
  };
}
