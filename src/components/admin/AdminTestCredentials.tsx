
import { LogIn } from "lucide-react";
import { ADMIN_CREDENTIALS } from "./AdminConstants";

export const AdminTestCredentials = () => {
  return (
    <div className="mt-6 p-4 bg-muted/50 rounded-md">
      <h3 className="text-sm font-medium mb-2 flex items-center">
        <LogIn className="h-4 w-4 mr-1" />
        Test Admin Credentials
      </h3>
      <div className="text-xs text-muted-foreground space-y-1">
        <p><span className="font-medium">Username:</span> {ADMIN_CREDENTIALS.username}</p>
        <p><span className="font-medium">Password:</span> {ADMIN_CREDENTIALS.password}</p>
      </div>
    </div>
  );
};
