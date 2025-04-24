
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

interface User {
  id: string;
  username?: string;
}

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedUser: string;
  onUserChange: (value: string) => void;
  users?: User[];
  usersLoading: boolean;
  onRefresh: () => void;
  isLoading: boolean;
}

export const SearchFilters = ({
  searchTerm,
  onSearchChange,
  selectedUser,
  onUserChange,
  users,
  usersLoading,
  onRefresh,
  isLoading
}: SearchFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search by prompt..."
          className="pl-9"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      
      <div className="w-full sm:w-64">
        <Select
          value={selectedUser}
          onValueChange={onUserChange}
          disabled={usersLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="Filter by user..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Users</SelectItem>
            {users?.map(user => (
              <SelectItem key={user.id} value={user.id}>
                {user.username || user.id.substring(0, 8)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Button 
        variant="outline" 
        size="icon" 
        onClick={onRefresh} 
        disabled={isLoading}
        className="h-10 w-10 shrink-0"
      >
        <RefreshCw className="h-4 w-4" />
      </Button>
    </div>
  );
};
