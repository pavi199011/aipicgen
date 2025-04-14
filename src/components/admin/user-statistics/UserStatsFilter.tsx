
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { UserFilterState } from "@/types/admin";

interface UserStatsFilterProps {
  filterState: UserFilterState;
  onFilterChange: (field: keyof UserFilterState, value: string) => void;
}

export const UserStatsFilter = ({ filterState, onFilterChange }: UserStatsFilterProps) => {
  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Filter by username"
        value={filterState.username}
        onChange={(e) => onFilterChange("username", e.target.value)}
        className="max-w-sm"
      />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="h-4 w-4 text-muted-foreground cursor-help" />
          </TooltipTrigger>
          <TooltipContent>
            <p>This section shows registered users and their generated images</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
