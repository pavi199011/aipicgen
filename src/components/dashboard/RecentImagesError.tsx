
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface RecentImagesErrorProps {
  error: string;
}

const RecentImagesError = ({ error }: RecentImagesErrorProps) => {
  return (
    <Alert variant="destructive" className="mt-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  );
};

export default RecentImagesError;
