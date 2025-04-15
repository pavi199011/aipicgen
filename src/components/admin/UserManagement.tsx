
import { User, UserStats } from "@/types/admin";
import { Skeleton } from "@/components/ui/skeleton";
import { UserFilter } from "./user-management/UserFilter";
import { UserTable } from "./user-management/UserTable";
import { UserPagination } from "./user-management/UserPagination";
import { UserSummary } from "./user-management/UserSummary";
import { UserDetailView } from "./UserDetailView";
import { ConfirmationDialog } from "./ConfirmationDialog";
import { useUserManagement } from "./user-management/useUserManagement";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent
} from "@/components/ui/sidebar";
import { Users, UserPlus, BarChart2, Activity, Filter, Search, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface UserManagementProps {
  users: User[];
  loading: boolean;
  onDeleteUser: (userId: string) => void;
  userStats?: UserStats[];
}

export const UserManagement = ({
  users,
  loading,
  onDeleteUser,
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
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6">User Management</h2>
      
      <SidebarProvider defaultOpen={true}>
        <div className="flex w-full min-h-[600px] border rounded-md bg-background">
          <Sidebar variant="floating" collapsible="icon">
            <SidebarHeader>
              <div className="flex items-center gap-2 px-4 py-2">
                <Users className="h-5 w-5" />
                <span className="font-semibold">User Management</span>
              </div>
            </SidebarHeader>
            
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Actions</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="View All Users">
                        <Users className="h-4 w-4" />
                        <span>All Users</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Add New User">
                        <UserPlus className="h-4 w-4" />
                        <span>Add User</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="User Statistics">
                        <BarChart2 className="h-4 w-4" />
                        <span>Statistics</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                      <SidebarMenuButton tooltip="Activity Logs">
                        <Activity className="h-4 w-4" />
                        <span>Activity</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
              
              <SidebarGroup>
                <SidebarGroupLabel>Filters</SidebarGroupLabel>
                <SidebarGroupContent>
                  <div className="p-2 space-y-3">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Filter Options</span>
                    </div>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search users..."
                        className="pl-8 text-sm"
                        value={filterState.username}
                        onChange={(e) => handleFilterChange('username', e.target.value)}
                      />
                    </div>
                  </div>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            
            <SidebarFooter>
              <div className="p-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  <span>Refresh</span>
                </Button>
              </div>
            </SidebarFooter>
          </Sidebar>
          
          <div className="flex-1 p-4 overflow-x-auto">
            <div className="mb-4">
              <UserFilter 
                filterState={filterState}
                onFilterChange={handleFilterChange}
              />
            </div>
            
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
          </div>
        </div>
      </SidebarProvider>
      
      {/* User Detail Dialog */}
      <UserDetailView
        user={selectedUser}
        userStats={getSelectedUserStats()}
        open={detailViewOpen}
        onClose={closeUserDetail}
        onDeleteUser={onDeleteUser}
      />
      
      {/* Confirmation Dialog */}
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
};
