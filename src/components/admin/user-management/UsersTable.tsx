
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Info } from "lucide-react";
import { UserDetailData, UserSortState } from "@/types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import UserDetailDialog from "./UserDetailDialog";
import UserTableHeader from "./table/UserTableHeader";
import UserTableRows from "./table/UserTableRows";
import UserTableContainer from "./table/UserTableContainer";
import DebugButton from "./table/DebugButton";

interface UsersTableProps {
  users: UserDetailData[];
  isLoading: boolean;
  sortState: UserSortState;
  onSort: (field: UserSortState["field"]) => void;
  onRefresh: () => void;
}

const UsersTable = ({ users, isLoading, sortState, onSort, onRefresh }: UsersTableProps) => {
  const [selectedUser, setSelectedUser] = useState<UserDetailData | null>(null);

  const handleShowDetails = (user: UserDetailData) => {
    setSelectedUser(user);
  };

  // Create header content for the table container
  const tableHeaderContent = (
    <div className="flex items-center justify-between mt-2">
      <div className="flex items-center text-sm text-muted-foreground">
        <Info className="h-4 w-4 mr-1" />
        <span>{users.length} users found</span>
      </div>
      <div className="flex space-x-2">
        <DebugButton users={users} />
        <Button variant="outline" onClick={onRefresh} disabled={isLoading} size="sm">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );

  return (
    <UserTableContainer
      title="User Management"
      description="View and manage all registered users in the system"
      headerContent={tableHeaderContent}
      isLoading={isLoading}
      loadingRows={5}
      bordered={true}
    >
      <UserTableHeader sortState={sortState} onSort={onSort} />
      <UserTableRows 
        users={users} 
        isLoading={isLoading} 
        onShowDetails={handleShowDetails} 
      />
      
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <UserDetailDialog user={selectedUser} onClose={() => setSelectedUser(null)} />
          </DialogContent>
        </Dialog>
      )}
    </UserTableContainer>
  );
};

export default UsersTable;
