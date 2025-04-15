
import { useState, useMemo, useCallback } from "react";
import { SortField, User, UserFilterState, UserSortState, UserStats } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";

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
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [actionToConfirm, setActionToConfirm] = useState<{type: 'delete' | 'suspend', userId: string} | null>(null);
  const { toast } = useToast();
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

  const confirmAction = (type: 'delete' | 'suspend', userId: string) => {
    setActionToConfirm({ type, userId });
    setConfirmationOpen(true);
  };

  const cancelAction = () => {
    setConfirmationOpen(false);
    setActionToConfirm(null);
  };

  const handleSuspendUser = useCallback((userId: string) => {
    // Implementation will be added when building the suspension feature
    toast({
      title: "User Suspended",
      description: "User has been suspended successfully.",
    });
  }, [toast]);

  // Filter users based on the filter state
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const username = user.username?.toLowerCase() || '';
      const email = user.email?.toLowerCase() || '';
      const searchTerm = filterState.username.toLowerCase();
      return username.includes(searchTerm) || email.includes(searchTerm);
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
  const currentUsers = sortedUsers.slice(indexOfFirstItem, indexOfLastItem);

  return {
    sortState,
    filterState,
    selectedUser,
    detailViewOpen,
    currentPage,
    confirmationOpen,
    actionToConfirm,
    indexOfFirstItem,
    indexOfLastItem,
    totalPages,
    sortedUsers,
    currentUsers,
    filteredUsers,
    handleSort,
    handleFilterChange,
    openUserDetail,
    closeUserDetail,
    confirmAction,
    cancelAction,
    setCurrentPage,
    handleSuspendUser,
    getSelectedUserStats
  };
}
