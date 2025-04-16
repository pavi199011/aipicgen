
import { useQuery } from "@tanstack/react-query";
import { UserDetailData, UserFilterState, UserSortState } from "@/types/admin";

/**
 * Hook for the user data query with React Query
 */
export function useUserDataQuery({
  sortState,
  filterState,
  currentPage,
  fetchTotalUserCount,
  fetchUserData,
  fetchUserEmails,
  setTotalPages,
  setCurrentPage
}: {
  sortState: UserSortState;
  filterState: UserFilterState;
  currentPage: number;
  fetchTotalUserCount: (filters: UserFilterState) => Promise<number>;
  fetchUserData: (filters: UserFilterState, sort: UserSortState, page: number, limit: number) => Promise<any[]>;
  fetchUserEmails: (userData: any[]) => Promise<UserDetailData[]>;
  setTotalPages: (pages: number) => void;
  setCurrentPage: (page: number) => void;
}) {
  const pageSize = 10;

  return useQuery({
    queryKey: ["users", sortState, filterState, currentPage],
    queryFn: async () => {
      try {
        // Get total count for pagination
        const totalCount = await fetchTotalUserCount(filterState);
        
        // Calculate total pages
        const calculatedTotalPages = Math.max(1, Math.ceil(totalCount / pageSize));
        setTotalPages(calculatedTotalPages);
        
        // Adjust current page if it's beyond the total pages
        if (currentPage > calculatedTotalPages) {
          setCurrentPage(calculatedTotalPages);
        }
        
        // Fetch the user data for the current page
        const userData = await fetchUserData(filterState, sortState, currentPage, pageSize);
        
        // If we have user data, fetch the email addresses
        if (userData && userData.length > 0) {
          return await fetchUserEmails(userData);
        }
        
        return userData as UserDetailData[];
      } catch (error) {
        console.error("Error in useUserDataQuery:", error);
        throw error;
      }
    },
  });
}
