
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserX } from "lucide-react";
import { deleteUserProfile } from "@/utils/supabase-helpers";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface UserDeleteActionProps {
  userId: string;
  username?: string;
  onUserDeleted: () => void;
}

const UserDeleteAction = ({ userId, username, onUserDeleted }: UserDeleteActionProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleDelete = async () => {
    setIsDeleting(true);
    setDeleteError(null);
    
    try {
      console.log("Initiating user deletion process for:", userId);
      const success = await deleteUserProfile(userId);
      
      if (success) {
        toast({
          title: "User Deleted",
          description: `User${username ? ` ${username}` : ''} has been completely deleted.`,
          variant: "default",
        });
        setIsConfirmOpen(false);
        
        // Call the callback to update the UI
        onUserDeleted();
      } else {
        const errorMsg = "There was an error deleting the user. Please try again.";
        setDeleteError(errorMsg);
        toast({
          title: "Delete Failed",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Exception in handleDelete:", error);
      const errorMsg = error instanceof Error ? error.message : "An unknown error occurred";
      setDeleteError(errorMsg);
      toast({
        title: "Delete Failed",
        description: `There was an error deleting the user: ${errorMsg}`,
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        variant="destructive"
        onClick={() => setIsConfirmOpen(true)}
        className="gap-2"
      >
        <UserX className="h-4 w-4" />
        Delete User
      </Button>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete User
            </AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the user account for {username || "this user"}, including all profiles, auth data, and generated images.
              This action cannot be undone. Are you sure you want to continue?
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          {deleteError && (
            <div className="text-destructive text-sm bg-destructive/10 p-3 rounded-md mb-3">
              Error: {deleteError}
            </div>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              onClick={(e) => {
                e.preventDefault();
                handleDelete();
              }}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserDeleteAction;
