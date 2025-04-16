
import { UserDetailData } from "@/types/admin";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { UserX, UserCheck, Mail } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";

interface UserDetailDialogProps {
  user: UserDetailData;
  onClose: () => void;
  onUserUpdated?: () => void;
}

const UserDetailDialog = ({ user, onClose, onUserUpdated }: UserDetailDialogProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  
  const getUserInitials = () => {
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  const handleActivateUser = async () => {
    if (user.is_active === true) return; // Already active
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: true })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "User Activated",
        description: "The user has been activated successfully.",
      });
      
      if (onUserUpdated) {
        onUserUpdated();
      }
      onClose();
    } catch (error) {
      console.error("Error activating user:", error);
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeactivateUser = async () => {
    if (user.is_active === false) return; // Already inactive
    setIsUpdating(true);
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "User Deactivated",
        description: "The user has been deactivated successfully.",
      });
      
      if (onUserUpdated) {
        onUserUpdated();
      }
      onClose();
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast({
        title: "Action Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="grid gap-6">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={user.avatarUrl || user.avatar_url || ""} alt={user.username || "User"} />
          <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
        </Avatar>
        
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-xl font-semibold">{user.username || "Anonymous"}</h3>
          <div className="flex items-center gap-1 justify-center sm:justify-start">
            <Mail className="h-4 w-4 text-gray-500" />
            <p className="text-gray-500">
              {typeof user.email === 'string' ? user.email : 'No email address available'}
              {user.email === null && <span className="text-xs text-red-500 ml-1">(missing)</span>}
            </p>
          </div>
          {user.full_name && <p className="mt-1">{user.full_name}</p>}
          <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
            {user.is_admin && (
              <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded">
                Admin
              </span>
            )}
            <Badge 
              variant={user.is_active === true ? "outline" : "destructive"} 
              className={user.is_active === true 
                ? "bg-green-50 text-green-700 border-green-200" 
                : ""
              }
            >
              {user.is_active === true ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">User ID</p>
          <p className="text-sm font-mono break-all">{user.id}</p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Joined</p>
          <p className="text-sm">
            {user.created_at 
              ? format(new Date(user.created_at), "PPP 'at' p") 
              : "Unknown"}
          </p>
        </div>
        
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Images Generated</p>
          <p className="text-sm">{user.image_count}</p>
        </div>
      </div>
      
      <div className="flex justify-between space-x-2">
        <div className="flex space-x-2">
          <Button 
            variant={user.is_active ? "outline" : "default"} 
            onClick={handleActivateUser}
            disabled={isUpdating || user.is_active === true}
          >
            <UserCheck className="h-4 w-4 mr-2" />
            Activate
          </Button>
          
          <Button 
            variant="destructive" 
            onClick={handleDeactivateUser}
            disabled={isUpdating || user.is_active === false}
          >
            <UserX className="h-4 w-4 mr-2" />
            Deactivate
          </Button>
        </div>
        
        <Button variant="ghost" onClick={onClose} disabled={isUpdating}>
          Close
        </Button>
      </div>
    </div>
  );
};

export default UserDetailDialog;
