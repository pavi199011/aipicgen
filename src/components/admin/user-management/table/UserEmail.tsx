
import { ReactNode } from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Mail, AlertCircle } from "lucide-react";

interface UserEmailProps {
  email: string | null | undefined;
}

const UserEmail = ({ email }: UserEmailProps) => {
  if (typeof email === 'string' && email.trim() !== '') {
    return (
      <div className="flex items-center gap-1">
        <Mail className="h-4 w-4 text-gray-500 mr-1" />
        <span>{email}</span>
      </div>
    );
  }
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className="cursor-help">
          <div className="flex items-center text-muted-foreground">
            <AlertCircle className="h-4 w-4 text-amber-500 mr-1" />
            <span>Email unavailable</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Email could not be retrieved from the database</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default UserEmail;
