
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { UserDetailData } from "@/types/admin";

interface UserActivationActionsProps {
  onRefresh: () => void;
}

export const useUserActivation = ({ onRefresh }: UserActivationActionsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleDeactivateUser = async (userId: string) => {
    setIsUpdating(true);
    try {
      console.log(`Deactivating user with ID: ${userId}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "User deactivated",
        description: "The user has been deactivated successfully.",
      });
      
      // Immediately refresh the data
      onRefresh();
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast({
        title: "Failed to deactivate user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleActivateUser = async (userId: string) => {
    setIsUpdating(true);
    try {
      console.log(`Activating user with ID: ${userId}`);
      
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', userId);
      
      if (error) throw error;
      
      toast({
        title: "User activated",
        description: "The user has been activated successfully.",
      });
      
      // Immediately refresh the data
      onRefresh();
    } catch (error) {
      console.error("Error activating user:", error);
      toast({
        title: "Failed to activate user",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    isUpdating,
    handleActivateUser,
    handleDeactivateUser
  };
};
