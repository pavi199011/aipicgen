
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2 } from "lucide-react";

interface SelectionControlsProps {
  selectedCount: number;
  totalCount: number;
  onToggleAll: () => void;
  onDelete: () => void;
  isDeleting: boolean;
}

export const SelectionControls = ({
  selectedCount,
  totalCount,
  onToggleAll,
  onDelete,
  isDeleting
}: SelectionControlsProps) => {
  return (
    <div className="flex gap-2 justify-between">
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="selectAll"
          checked={totalCount > 0 && selectedCount === totalCount}
          onCheckedChange={onToggleAll}
          disabled={totalCount === 0}
        />
        <label htmlFor="selectAll" className="text-sm font-medium">
          {selectedCount > 0 
            ? `Selected ${selectedCount} images` 
            : "Select All"}
        </label>
      </div>
      
      <Button
        variant="destructive"
        size="sm"
        onClick={onDelete}
        disabled={selectedCount === 0 || isDeleting}
        className="flex gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Delete Selected
      </Button>
    </div>
  );
};
