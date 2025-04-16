
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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
import { Shield, ShieldAlert } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface UserStatusToggleProps {
  userId: string;
  isActive: boolean;
  onStatusChange: (isActive: boolean) => void;
}

const UserStatusToggle = ({ userId, isActive, onStatusChange }: UserStatusToggleProps) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleToggle = (newStatus: boolean) => {
    setPendingStatus(newStatus);
    setIsConfirmOpen(true);
  };

  const confirmStatusChange = async () => {
    if (pendingStatus === null) return;
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: pendingStatus })
        .eq('id', userId);

      if (error) throw error;

      onStatusChange(pendingStatus);
      toast({
        title: pendingStatus ? "User Activated" : "User Deactivated",
        description: `User has been ${pendingStatus ? "activated" : "deactivated"} successfully.`,
        variant: pendingStatus ? "default" : "destructive",
      });
    } catch (error) {
      console.error("Error updating user status:", error);
      toast({
        title: "Status Update Failed",
        description: "There was an error updating the user status.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
      setIsConfirmOpen(false);
      setPendingStatus(null);
    }
  };

  return (
    <>
      <div className="flex items-center space-x-3">
        <Switch 
          checked={isActive} 
          onCheckedChange={handleToggle}
          disabled={isUpdating}
        />
        <div className="space-y-0.5">
          <Label htmlFor="user-status">
            User Status: {isActive ? "Active" : "Inactive"}
          </Label>
          <p className="text-sm text-muted-foreground">
            {isActive 
              ? "User can log in and use the application" 
              : "User cannot log in or use the application"}
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="ml-2">
                {isActive ? (
                  <Shield className="h-5 w-5 text-green-500" />
                ) : (
                  <ShieldAlert className="h-5 w-5 text-red-500" />
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isActive ? "User is active" : "User is deactivated"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {pendingStatus ? "Activate User" : "Deactivate User"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {pendingStatus 
                ? "This will allow the user to log in and use the application. Are you sure you want to activate this user?"
                : "This will prevent the user from logging in or using the application. Are you sure you want to deactivate this user?"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isUpdating}
              onClick={(e) => {
                e.preventDefault();
                confirmStatusChange();
              }}
              className={pendingStatus ? undefined : "bg-destructive hover:bg-destructive/90"}
            >
              {isUpdating ? "Processing..." : "Continue"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default UserStatusToggle;
