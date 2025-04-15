
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
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

  return (
    <div>
      <div className="flex justify-between mb-4">
        <DebugButton users={users} />
        
        <Button variant="outline" onClick={onRefresh} disabled={isLoading}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      <UserTableContainer>
        <UserTableHeader sortState={sortState} onSort={onSort} />
        <UserTableRows 
          users={users} 
          isLoading={isLoading} 
          onShowDetails={handleShowDetails} 
        />
      </UserTableContainer>

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
    </div>
  );
};

export default UsersTable;
