
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AdminLockoutAlertProps {
  lockoutTimeRemaining: number;
  formatLockoutTime: (ms: number) => string;
}

export const AdminLockoutAlert = ({ 
  lockoutTimeRemaining,
  formatLockoutTime
}: AdminLockoutAlertProps) => {
  return (
    <Alert className="mb-4 bg-red-50 border-red-200">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertDescription className="text-red-700">
        <strong>Account temporarily locked</strong><br />
        Too many failed login attempts. Please try again in {formatLockoutTime(lockoutTimeRemaining)}.
      </AlertDescription>
    </Alert>
  );
};
