
import { useUserData } from "./useUserData";
import { useUserStats } from "./useUserStats";
import { useAdminManagement } from "./useAdminManagement";

export function useAdminData(userId: string | undefined) {
  const {
    users,
    loading,
    deleteUser,
    fetchUsers,
    createUser
  } = useUserData(userId);
  
  const {
    userStats,
    loadingStats,
    fetchUserStats
  } = useUserStats(userId);
  
  const {
    addAdmin
  } = useAdminManagement();

  return {
    users,
    userStats,
    loading,
    loadingStats,
    deleteUser,
    fetchUsers,
    fetchUserStats,
    addAdmin,
    createUser
  };
}
