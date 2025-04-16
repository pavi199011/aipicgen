
import { useState } from "react";
import { UserDetailData } from "@/types/admin";
import { DialogTitle, DialogHeader, DialogDescription } from "@/components/ui/dialog";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import UserAvatar from "./UserAvatar";
import UserBasicInfo from "./UserBasicInfo";
import UserMetadata from "./UserMetadata";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface UserDetailContentProps {
  user: UserDetailData;
  onClose: () => void;
}

const UserDetailContent = ({ user, onClose }: UserDetailContentProps) => {
  const [activeTab, setActiveTab] = useState("basic");

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
          View detailed information about {user.username || "this user"}
        </DialogDescription>
      </DialogHeader>

      <div className="flex flex-col items-center py-6 gap-4">
        <UserAvatar user={user} size="xl" />
        <div className="text-center">
          <h3 className="text-lg font-medium">{user.username || "Anonymous User"}</h3>
          <p className="text-sm text-gray-500">{user.email || "No email available"}</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="metadata">Metadata</TabsTrigger>
        </TabsList>
        <TabsContent value="basic" className="py-4">
          <UserBasicInfo user={user} />
        </TabsContent>
        <TabsContent value="metadata" className="py-4">
          <UserMetadata user={user} />
        </TabsContent>
      </Tabs>
    </>
  );
};

export default UserDetailContent;
