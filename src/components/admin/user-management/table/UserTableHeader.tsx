
import { TableHeader, TableRow, TableHead } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ArrowUpDown } from "lucide-react";
import { UserSortState } from "@/types/admin";

interface UserTableHeaderProps {
  sortState: UserSortState;
  onSort: (field: UserSortState["field"]) => void;
}

const UserTableHeader = ({ sortState, onSort }: UserTableHeaderProps) => {
  const getSortIcon = (field: UserSortState["field"]) => {
    if (sortState.field !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-100" />;
  };

  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[200px]">
          <Button variant="ghost" onClick={() => onSort("username")} className="p-0 text-left font-medium">
            Username
            {getSortIcon("username")}
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" onClick={() => onSort("email")} className="p-0 text-left font-medium">
            Email
            {getSortIcon("email")}
          </Button>
        </TableHead>
        <TableHead>
          <Button variant="ghost" onClick={() => onSort("created_at")} className="p-0 text-left font-medium">
            Joined
            {getSortIcon("created_at")}
          </Button>
        </TableHead>
        <TableHead className="text-right">
          <Button variant="ghost" onClick={() => onSort("image_count")} className="p-0 text-left font-medium">
            Images
            {getSortIcon("image_count")}
          </Button>
        </TableHead>
        <TableHead className="text-right">Status</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};

export default UserTableHeader;
