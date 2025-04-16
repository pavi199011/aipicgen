
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserDetailData, UserSortState } from "@/types/admin";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserTableHeader from "./table/UserTableHeader";
import UserTableRows from "./table/UserTableRows";
import TableHeaderContent from "./table/TableHeaderContent";
import { useUserActivation } from "./actions/UserActivationActions";
import { useUserDeletion } from "./actions/UserDeletionActions";
import { UserDetailsDialog, useUserDetails } from "./dialogs/UserDetailsDialog";
import { DeleteUserDialog } from "./dialogs/DeleteUserDialog";

interface UsersTableProps {
  users: UserDetailData[];
  isLoading: boolean;
  sortState: UserSortState;
  onSort: (field: UserSortState["field"]) => void;
  onRefresh: () => void;
}

const UsersTable = ({ users, isLoading, sortState, onSort, onRefresh }: UsersTableProps) => {
  // User details handling
  const {
    selectedUser,
    handleShowDetails,
    handleCloseDetails
  } = useUserDetails();

  // User activation/deactivation handling
  const {
    isUpdating,
    handleActivateUser,
    handleDeactivateUser
  } = useUserActivation({ onRefresh });

  // User deletion handling
  const {
    userToDelete,
    isDeleting,
    confirmDeleteUser,
    cancelDeleteUser,
    handleDeleteUser
  } = useUserDeletion({ onRefresh });

  const handleUserUpdated = () => {
    onRefresh();
    handleCloseDetails();
  };

  // Create header content for the table container
  const tableHeaderContent = (
    <TableHeaderContent 
      users={users} 
      isLoading={isLoading} 
      isUpdating={isUpdating || isDeleting} 
      onRefresh={onRefresh}
    />
  );

  return (
    <>
      <div className="bg-white rounded-md border shadow-sm overflow-hidden">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">User Management</h3>
          <p className="text-sm text-gray-500">View and manage all registered users in the system</p>
          {tableHeaderContent}
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <UserTableHeader sortState={sortState} onSort={onSort} />
            <UserTableRows 
              users={users} 
              isLoading={isLoading || isUpdating || isDeleting} 
              onShowDetails={handleShowDetails} 
              onDeactivateUser={handleDeactivateUser}
              onActivateUser={handleActivateUser}
              onDeleteUser={confirmDeleteUser}
            />
          </table>
        </div>
      </div>
      
      {/* User Details Dialog */}
      <UserDetailsDialog 
        selectedUser={selectedUser}
        onClose={handleCloseDetails}
        onUserUpdated={handleUserUpdated}
      />

      {/* Delete User Confirmation Dialog */}
      <DeleteUserDialog 
        userToDelete={userToDelete}
        isDeleting={isDeleting}
        onCancel={cancelDeleteUser}
        onConfirm={handleDeleteUser}
      />
    </>
  );
};

export default UsersTable;
