
import { UserFilterState } from "@/types/admin";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserFilterProps {
  filterState: UserFilterState;
  onFilterChange: (field: keyof UserFilterState, value: string) => void;
}

export const UserFilter = ({ filterState, onFilterChange }: UserFilterProps) => {
  const clearFilter = () => {
    onFilterChange("username", "");
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFilterChange("username", e.target.value);
  };
  
  return (
    <div className="flex items-center space-x-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Filter by username or email..."
          value={filterState.username}
          onChange={handleInputChange}
          className="pl-9 w-full"
        />
        {filterState.username && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1 h-7 w-7"
            onClick={clearFilter}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Clear</span>
          </Button>
        )}
      </div>
      
      <Button
        variant="outline"
        size="sm"
        onClick={clearFilter}
        disabled={!filterState.username}
      >
        Reset
      </Button>
    </div>
  );
};
