
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

interface DeleteUserButtonProps {
  onDelete: () => void;
}

export const DeleteUserButton = ({ onDelete }: DeleteUserButtonProps) => {
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const handleDelete = () => {
    onDelete();
    setDeleteConfirmOpen(false);
  };

  return (
    <>
      <Button 
        variant="destructive"
        onClick={() => setDeleteConfirmOpen(true)}
      >
        <Trash2 className="h-4 w-4 mr-2" />
        Delete User
      </Button>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button 
              variant="outline" 
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
