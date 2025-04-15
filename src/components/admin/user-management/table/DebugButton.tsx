
import { Button } from "@/components/ui/button";
import { UserDetailData } from "@/types/admin";

interface DebugButtonProps {
  users: UserDetailData[];
}

const DebugButton = ({ users }: DebugButtonProps) => {
  const debugUserData = () => {
    console.log("Current users data:", users);
    console.log("Users with email defined:", users.filter(user => !!user.email).length);
    console.log("Users without email:", users.filter(user => !user.email).length);
  };

  return (
    <Button variant="outline" size="sm" onClick={debugUserData} className="text-xs">
      Debug User Data
    </Button>
  );
};

export default DebugButton;
