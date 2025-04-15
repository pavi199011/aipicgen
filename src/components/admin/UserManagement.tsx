
import { Skeleton } from "@/components/ui/skeleton";
import { User, UserStats } from "@/types/admin";
import { UserDetailView } from "./UserDetailView";
import { UserTable } from "./user-management/UserTable";
import { UserFilter } from "./user-management/UserFilter";
import { UserPagination } from "./user-management/UserPagination";
import { UserSummary } from "./user-management/UserSummary";
import { useUserManagement } from "./user-management/useUserManagement";
import { ConfirmationDialog } from "./ConfirmationDialog";

interface UserManagementProps {
  users: User[];
  loading: boolean;
  onDeleteUser: (userId: string) => void;
  onSuspendUser?: (userId: string) => void;
  userStats?: UserStats[]; // Optional stats for detailed view
}

export const UserManagement = ({ 
  users, 
  loading, 
  onDeleteUser,
  onSuspendUser,
  userStats = []
}: UserManagementProps) => {
  const {
    sortState,
    filterState,
    selectedUser,
    detailViewOpen,
    currentPage,
    confirmationOpen,
    actionToConfirm,
    totalPages,
    currentUsers,
    filteredUsers,
    handleSort,
    handleFilterChange,
    openUserDetail,
    closeUserDetail,
    confirmAction,
    cancelAction,
    setCurrentPage,
    getSelectedUserStats
  } = useUserManagement(users, userStats);

  const handleConfirmAction = () => {
    if (!actionToConfirm) return;
    
    if (actionToConfirm.type === 'delete') {
      onDeleteUser(actionToConfirm.userId);
    } else if (actionToConfirm.type === 'suspend' && onSuspendUser) {
      onSuspendUser(actionToConfirm.userId);
    }
    
    cancelAction();
  };

  if (loading) {
    return <UserLoadingSkeleton />;
  }

  return (
    <>
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      <div className="space-y-4">
        <UserFilter 
          filterState={filterState} 
          onFilterChange={handleFilterChange} 
        />
        
        <UserTable 
          users={currentUsers}
          sortState={sortState}
          onSort={handleSort}
          onUserSelect={openUserDetail}
          onConfirmDelete={(userId) => confirmAction('delete', userId)}
          onConfirmSuspend={(userId) => confirmAction('suspend', userId)}
        />
        
        <UserPagination 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
        
        <UserSummary 
          currentCount={currentUsers.length}
          filteredCount={filteredUsers.length}
          totalCount={users.length}
        />
      </div>

      <UserDetailView 
        user={selectedUser}
        userStats={getSelectedUserStats()}
        open={detailViewOpen}
        onClose={closeUserDetail}
        onDeleteUser={(userId) => confirmAction('delete', userId)}
      />

      <ConfirmationDialog
        open={confirmationOpen}
        onClose={cancelAction}
        onConfirm={handleConfirmAction}
        title={actionToConfirm?.type === 'delete' ? "Delete User" : "Suspend User"}
        description={
          actionToConfirm?.type === 'delete' 
            ? "Are you sure you want to delete this user? This action cannot be undone."
            : "Are you sure you want to suspend this user? They will no longer be able to log in."
        }
        confirmLabel={actionToConfirm?.type === 'delete' ? "Delete" : "Suspend"}
        variant="destructive"
      />
    </>
  );
};

// Loading skeleton component
const UserLoadingSkeleton = () => (
  <>
    <h2 className="text-2xl font-bold mb-6">User Management</h2>
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[200px]" />
          </div>
        </div>
      ))}
    </div>
  </>
);
