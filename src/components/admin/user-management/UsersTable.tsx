
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, Info } from "lucide-react";
import { UserDetailData, UserSortState } from "@/types/admin";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import UserDetailDialog from "./UserDetailDialog";
import UserTableHeader from "./table/UserTableHeader";
import UserTableRows from "./table/UserTableRows";
import UserTableContainer from "./UserTableContainer";
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
  const [userToDelete, setUserToDelete] = useState<UserDetailData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleShowDetails = (user: UserDetailData) => {
    setSelectedUser(user);
  };

  const handleSuspendUser = async (userId: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: true })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "User suspended",
        description: "The user has been suspended successfully.",
      });
      
      onRefresh(); // Refresh the user list
    } catch (error) {
      console.error("Error suspending user:", error);
      toast({
        title: "Failed to suspend user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUnsuspendUser = async (userId: string) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_suspended: false })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "User unsuspended",
        description: "The user has been unsuspended successfully.",
      });
      
      onRefresh(); // Refresh the user list
    } catch (error) {
      console.error("Error unsuspending user:", error);
      toast({
        title: "Failed to unsuspend user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmDeleteUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setUserToDelete(user);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsUpdating(true);
    try {
      // Get the current user's token for authentication
      const { data: sessionData } = await supabase.auth.getSession();
      const token = sessionData.session?.access_token;
      
      if (!token) throw new Error("Not authenticated");
      
      // Call our edge function to delete the user
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId: userToDelete.id },
      });
      
      if (error) throw error;
      
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      });
      
      setUserToDelete(null);
      onRefresh(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Failed to delete user",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUserUpdated = () => {
    onRefresh();
    setSelectedUser(null);
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
        <Button variant="outline" onClick={onRefresh} disabled={isLoading || isUpdating} size="sm">
          <RefreshCcw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
    </div>
  );

  return (
    <>
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
          isLoading={isLoading || isUpdating} 
          onShowDetails={handleShowDetails} 
          onSuspendUser={handleSuspendUser}
          onUnsuspendUser={handleUnsuspendUser}
          onDeleteUser={confirmDeleteUser}
        />
      </UserTableContainer>
      
      {/* User Details Dialog */}
      {selectedUser && (
        <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>User Details</DialogTitle>
            </DialogHeader>
            <UserDetailDialog 
              user={selectedUser} 
              onClose={() => setSelectedUser(null)} 
              onUserUpdated={handleUserUpdated}
            />
          </DialogContent>
        </Dialog>
      )}

      {/* Delete User Confirmation Dialog */}
      {userToDelete && (
        <AlertDialog open={!!userToDelete} onOpenChange={(open) => !open && setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete User</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete the user "{userToDelete.username || 'Unknown'}"? 
                This action cannot be undone and will permanently delete their account and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteUser}
                disabled={isUpdating}
                className="bg-red-600 hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
};

export default UsersTable;
