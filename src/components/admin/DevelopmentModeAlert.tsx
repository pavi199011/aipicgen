
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const DevelopmentModeAlert = () => {
  return (
    <Alert className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20 mb-0">
      <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
      <AlertDescription className="text-yellow-700 dark:text-yellow-300">
        <strong>Development Mode:</strong> Admin authentication is bypassed. In production, proper authentication would be required.
      </AlertDescription>
    </Alert>
  );
};
