
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UserFilterState } from "@/types/admin";
import { Search, X } from "lucide-react";

interface UserFiltersProps {
  onFilter: (filters: UserFilterState) => void;
}

const UserFilters = ({ onFilter }: UserFiltersProps) => {
  const [username, setUsername] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({ username });
  };

  const handleClear = () => {
    setUsername("");
    onFilter({ username: "" });
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full md:w-auto gap-2">
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
        <Input
          type="text"
          placeholder="Search by username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="pl-9 w-full"
        />
        {username && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-2.5 top-2.5 text-gray-500 hover:text-gray-700"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
      <Button type="submit">Search</Button>
    </form>
  );
};

export default UserFilters;
