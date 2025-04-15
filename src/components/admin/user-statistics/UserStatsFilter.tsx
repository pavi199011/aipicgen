
import { Input } from "@/components/ui/input";
import { UserFilterState } from "@/types/admin";
import { Search } from "lucide-react";

interface UserStatsFilterProps {
  filterState: UserFilterState;
  onFilterChange: (field: keyof UserFilterState, value: string) => void;
}

export const UserStatsFilter = ({ filterState, onFilterChange }: UserStatsFilterProps) => {
  return (
    <div className="flex items-center space-x-2 relative">
      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
      <Input
        placeholder="Search by username or email"
        value={filterState.username}
        onChange={(e) => onFilterChange("username", e.target.value)}
        className="pl-10 max-w-sm"
      />
    </div>
  );
};
