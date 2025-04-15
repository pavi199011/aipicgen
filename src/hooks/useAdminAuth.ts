
import { useAdminAuthState } from "./admin/useAdminAuthState";
import { useAdminAuthMethods } from "./admin/useAdminAuthMethods";

export interface AdminCredentials {
  identifier: string; // Can be username or email
  password: string;
}

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
