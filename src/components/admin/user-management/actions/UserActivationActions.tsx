
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
    console.log("Deactivating user:", userId);
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);
      
      if (error) throw error;
      
      console.log("User deactivated successfully, userId:", userId);
      
      toast({
        title: "User deactivated",
        description: "The user has been deactivated successfully and will not be able to log in.",
      });
      
      // Immediately refresh the data after updating
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
    console.log("Activating user:", userId);
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', userId);
      
      if (error) throw error;
      
      console.log("User activated successfully, userId:", userId);
      
      toast({
        title: "User activated",
        description: "The user has been activated successfully and can now log in.",
      });
      
      // Immediately refresh the data after updating
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
