
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SortDirection, SortField, UserStats, UserSortState } from "@/types/admin";
import { ArrowUpDown, Users } from "lucide-react";

interface UserStatsTableProps {
  paginatedUsers: UserStats[];
  sortState: UserSortState;
  onSort: (field: SortField) => void;
  onUserSelect: (user: UserStats) => void;
  filteredUsers: UserStats[];
}

export const UserStatsTable = ({
  paginatedUsers,
  sortState,
  onSort,
  onUserSelect,
  filteredUsers
}: UserStatsTableProps) => {
  const getSortIcon = (field: SortField) => {
    if (sortState.field !== field) return null;
    return <ArrowUpDown className={`ml-1 h-4 w-4 ${sortState.direction === "asc" ? "rotate-0" : "rotate-180"}`} />;
  };

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort("username")}
              >
                <div className="flex items-center">
                  Username
                  {getSortIcon("username")}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer"
                onClick={() => onSort("imageCount")}
              >
                <div className="flex items-center">
                  Images Generated
                  {getSortIcon("imageCount")}
                </div>
              </TableHead>
              <TableHead>Email</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                  <div className="flex flex-col items-center">
                    <Users className="h-8 w-8 text-gray-300 mb-2" />
                    {filteredUsers.length === 0 ? 
                      "No users match your filters" : 
                      "No users on this page"}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              paginatedUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <button 
                      onClick={() => onUserSelect(user)}
                      className="text-primary hover:underline focus:outline-none focus:underline"
                    >
                      {user.username || 'No username'}
                    </button>
                  </TableCell>
                  <TableCell>{user.imageCount}</TableCell>
                  <TableCell>{user.email || 'No email'}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
