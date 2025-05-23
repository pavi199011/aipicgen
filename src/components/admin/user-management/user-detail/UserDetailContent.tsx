import { useState } from "react";
import { UserDetailData } from "@/types/admin";
import { DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "./UserAvatar";
import UserBasicInfo from "./UserBasicInfo";
import UserMetadata from "./UserMetadata";
import UserStatusToggle from "./UserStatusToggle";
import UserDeleteAction from "./UserDeleteAction";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { UserCreditManagement } from "./UserCreditManagement";

interface UserDetailContentProps {
  user: UserDetailData;
  onClose: () => void;
  onUserUpdate?: (updatedUser: UserDetailData) => void;
  onUserDeleted?: () => void;
}

const UserDetailContent = ({ 
  user, 
  onClose, 
  onUserUpdate,
  onUserDeleted 
}: UserDetailContentProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [userData, setUserData] = useState<UserDetailData>(user);

  const handleStatusChange = (isActive: boolean) => {
    const updatedUser = { ...userData, is_active: isActive };
    setUserData(updatedUser);
    
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  const handleUserDeleted = () => {
    onClose();
    
    if (onUserDeleted) {
      onUserDeleted();
    }
  };

  const handleCreditUpdate = (newCredits: number) => {
    const updatedUser = { ...userData, credits: newCredits };
    setUserData(updatedUser);
    
    if (onUserUpdate) {
      onUserUpdate(updatedUser);
    }
  };

  return (
    <>
      <DialogHeader className="relative pb-4 border-b">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute right-0 top-0"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <DialogTitle className="text-xl">User Details</DialogTitle>
        <DialogDescription>
          View detailed information about {userData.username || "this user"}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col sm:flex-row items-center py-6 gap-4">
        <UserAvatar user={userData} size="xl" />
        <UserBasicInfo user={userData} />
      </div>
      
      <Separator className="my-4" />
      
      <div className="mb-6 space-y-4">
        <UserStatusToggle 
          userId={userData.id} 
          isActive={userData.is_active !== false} 
          onStatusChange={handleStatusChange}
        />
        
        <div className="mt-4">
          <UserDeleteAction 
            userId={userData.id}
            username={userData.username}
            onUserDeleted={handleUserDeleted}
          />
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
          <TabsTrigger value="credits">Credits</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="py-4">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Username</h4>
                <p>{userData.username || "Not set"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Full Name</h4>
                <p>{userData.full_name || "Not set"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Email</h4>
                <p>{userData.email || "Not set"}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Joined</h4>
                <p>{new Date(userData.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="metadata" className="py-4">
          <UserMetadata user={userData} />
        </TabsContent>
        <TabsContent value="credits" className="py-4">
          <UserCreditManagement 
            userId={userData.id} 
            currentCredits={userData.credits || 0}
            onCreditUpdate={handleCreditUpdate}
          />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default UserDetailContent;
