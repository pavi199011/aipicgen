
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserDetailData } from "@/types/admin";

interface UserDeletionActionsProps {
  onRefresh: () => void;
}

export const useUserDeletion = ({ onRefresh }: UserDeletionActionsProps) => {
  const [userToDelete, setUserToDelete] = useState<UserDetailData | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const confirmDeleteUser = (user: UserDetailData) => {
    setUserToDelete(user);
  };

  const cancelDeleteUser = () => {
    setUserToDelete(null);
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;
    
    setIsDeleting(true);
    try {
      // Call our edge function to delete the user
      const { data, error } = await supabase.functions.invoke('admin-delete-user', {
        body: { userId: userToDelete.id },
      });
      
      if (error) throw error;
      
      toast({
        title: "User deleted",
        description: "The user has been deleted successfully.",
      });
      
      setUserToDelete(null);
      onRefresh(); // Refresh the user list
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Failed to delete user",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    userToDelete,
    isDeleting,
    confirmDeleteUser,
    cancelDeleteUser,
    handleDeleteUser
  };
};
