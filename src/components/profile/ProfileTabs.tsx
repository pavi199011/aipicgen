
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileDetailsCard from "./cards/ProfileDetailsCard";
import SecurityCard from "./cards/SecurityCard";

interface ProfileTabsProps {
  user: {
    id: string;
    email?: string;
  };
}

const ProfileTabs = ({ user }: ProfileTabsProps) => {
  return (
    <Tabs defaultValue="profile" className="space-y-8">
      <TabsList>
        <TabsTrigger value="profile">Profile Information</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      
      <TabsContent value="profile" className="space-y-6">
        <ProfileDetailsCard user={user} />
      </TabsContent>
      
      <TabsContent value="security">
        <SecurityCard />
      </TabsContent>
    </Tabs>
  );
};

export default ProfileTabs;
