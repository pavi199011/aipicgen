
import { Input } from "@/components/ui/input";
import { UserFilterState } from "@/types/admin";

interface UserFilterProps {
  filterState: UserFilterState;
  onFilterChange: (field: keyof UserFilterState, value: string) => void;
}

export const UserFilter = ({ filterState, onFilterChange }: UserFilterProps) => {
  return (
    <div className="flex items-center">
      <Input
        placeholder="Filter by username"
        value={filterState.username}
        onChange={(e) => onFilterChange("username", e.target.value)}
        className="max-w-sm"
      />
    </div>
  );
};
