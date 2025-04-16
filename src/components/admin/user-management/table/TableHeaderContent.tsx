
import { Button } from "@/components/ui/button";
import { RefreshCcw, Info } from "lucide-react";
import { UserDetailData } from "@/types/admin";
import DebugButton from "./DebugButton";

interface TableHeaderContentProps {
  users: UserDetailData[];
  isLoading: boolean;
  isUpdating: boolean;
  onRefresh: () => void;
}

const TableHeaderContent = ({ 
  users, 
  isLoading, 
  isUpdating, 
  onRefresh 
}: TableHeaderContentProps) => {
  return (
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
};

export default TableHeaderContent;
