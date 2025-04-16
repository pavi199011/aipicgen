
import { useState } from "react";
import { UserDetailData } from "@/types/admin";
import { DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "./UserAvatar";
import UserBasicInfo from "./UserBasicInfo";
import UserMetadata from "./UserMetadata";
import UserStatusToggle from "./UserStatusToggle";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface UserDetailContentProps {
  user: UserDetailData;
  onClose: () => void;
  onUserUpdate?: (updatedUser: UserDetailData) => void;
}

const UserDetailContent = ({ user, onClose, onUserUpdate }: UserDetailContentProps) => {
  const [activeTab, setActiveTab] = useState("basic");
  const [userData, setUserData] = useState<UserDetailData>(user);

  const handleStatusChange = (isActive: boolean) => {
    const updatedUser = { ...userData, is_active: isActive };
    setUserData(updatedUser);
    
    // Notify parent component about the user update
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
      
      <div className="mb-6">
        <UserStatusToggle 
          userId={userData.id} 
          isActive={userData.is_active !== false} 
          onStatusChange={handleStatusChange}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
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
      </Tabs>
    </>
  );
};

export default UserDetailContent;
