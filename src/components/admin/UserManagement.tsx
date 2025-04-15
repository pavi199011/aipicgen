
import { User, UserStats } from "@/types/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { UserFilter } from "./user-management/UserFilter";
import { UserTable } from "./user-management/UserTable";
import { UserPagination } from "./user-management/UserPagination";
import { UserSummary } from "./user-management/UserSummary";
import { UserDetailView } from "./UserDetailView";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useUserManagement } from "./user-management/useUserManagement";
import { Button } from "@/components/ui/button";
import { Loader2, RefreshCw } from "lucide-react";

interface UserManagementProps {
  users: User[];
  loading: boolean;
  onDeleteUser: (userId: string) => void;
  userStats?: UserStats[];
  onRefreshUsers?: () => void;
}

export const UserManagement = ({
  users,
  loading,
  onDeleteUser,
  userStats = [],
  onRefreshUsers
}: UserManagementProps) => {
  const {
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

  const handleConfirmDelete = () => {
    if (actionToConfirm && actionToConfirm.type === 'delete') {
      onDeleteUser(actionToConfirm.userId);
    }
    cancelAction();
  };

  if (loading) {
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">User Management</h2>
        <div className="mb-4">
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        {onRefreshUsers && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onRefreshUsers}
            className="flex items-center gap-2"
            disabled={loading}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            <span>Refresh Users</span>
          </Button>
        )}
      </div>
      
      <div className="mb-4">
        <UserFilter 
          filterState={filterState}
          onFilterChange={handleFilterChange}
        />
      </div>
      
      {users.length === 0 && !loading ? (
        <div className="text-center py-10 bg-gray-50 rounded-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <p className="text-muted-foreground">No users found. Try refreshing or checking your connection.</p>
          {onRefreshUsers && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefreshUsers}
              className="mt-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              <span>Refresh Users</span>
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <UserTable
            users={currentUsers}
            sortState={sortState}
            onSort={handleSort}
            onUserSelect={openUserDetail}
            onConfirmDelete={(userId) => confirmAction('delete', userId)}
            onConfirmSuspend={(userId) => confirmAction('suspend', userId)}
          />
          
          {filteredUsers.length > 0 && (
            <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0 sm:space-x-4">
              <UserSummary
                currentCount={currentUsers.length}
                filteredCount={filteredUsers.length}
                totalCount={users.length}
                startIndex={indexOfFirstItem}
                endIndex={Math.min(indexOfLastItem, filteredUsers.length)}
              />
              
              <UserPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </div>
      )}
      
      <UserDetailView
        user={selectedUser}
        userStats={getSelectedUserStats()}
        open={detailViewOpen}
        onClose={closeUserDetail}
        onDeleteUser={onDeleteUser}
      />
      
      <ConfirmationDialog
        open={confirmationOpen}
        onClose={cancelAction}
        onConfirm={handleConfirmDelete}
        title={actionToConfirm?.type === 'delete' ? "Delete User" : "Suspend User"}
        description={
          actionToConfirm?.type === 'delete' 
            ? "Are you sure you want to delete this user? This action cannot be undone."
            : "Are you sure you want to suspend this user?"
        }
        confirmLabel={actionToConfirm?.type === 'delete' ? "Delete" : "Suspend"}
        variant={actionToConfirm?.type === 'delete' ? "destructive" : "default"}
      />
    </div>
  );
}
