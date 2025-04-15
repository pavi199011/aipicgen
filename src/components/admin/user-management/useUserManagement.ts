
import { useState, useMemo } from "react";
import { SortField, User, UserFilterState, UserSortState, UserStats } from "@/types/admin";

export function useUserManagement(users: User[], userStats: UserStats[] = []) {
  const [sortState, setSortState] = useState<UserSortState>({
    field: "created_at",
    direction: "desc"
  });
  
  const [filterState, setFilterState] = useState<UserFilterState>({
    username: ""
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [detailViewOpen, setDetailViewOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    setSortState({
      field,
      direction: sortState.field === field && sortState.direction === "asc" ? "desc" : "asc"
    });
  };

  const handleFilterChange = (field: keyof UserFilterState, value: string) => {
    setFilterState({
      ...filterState,
      [field]: value
    });
    setCurrentPage(1); // Reset to first page when filtering
  };

  const openUserDetail = (user: User) => {
    setSelectedUser(user);
    setDetailViewOpen(true);
  };

  const closeUserDetail = () => {
    setDetailViewOpen(false);
    setTimeout(() => setSelectedUser(null), 300);
  };

  const getSelectedUserStats = (): UserStats | null => {
    if (!selectedUser) return null;
    return userStats.find(stat => stat.id === selectedUser.id) || null;
  };

  // Filter users based on the filter state
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const username = user.username?.toLowerCase() || '';
      return username.includes(filterState.username.toLowerCase());
    });
  }, [users, filterState.username]);

  // Sort users based on the sort state
  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const direction = sortState.direction === "asc" ? 1 : -1;
      
      switch (sortState.field) {
        case "username":
          const usernameA = a.username?.toLowerCase() || '';
          const usernameB = b.username?.toLowerCase() || '';
          return usernameA.localeCompare(usernameB) * direction;
        case "created_at":
          return (new Date(a.created_at).getTime() - new Date(b.created_at).getTime()) * direction;
        default:
          return 0;
      }
    });
  }, [filteredUsers, sortState]);

  // Get pagination data
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);

  return {
    sortState,
    filterState,
    selectedUser,
    detailViewOpen,
    currentPage,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    sortedUsers,
    filteredUsers,
    handleSort,
    handleFilterChange,
    openUserDetail,
    closeUserDetail,
    setCurrentPage,
    getSelectedUserStats
  };
}
