
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface GalleryErrorStateProps {
  error: string;
  onRetry: () => Promise<void>;
}

const GalleryErrorState = ({ error, onRetry }: GalleryErrorStateProps) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex flex-col">
        <span>{error}</span>
        <Button 
          variant="outline" 
          size="sm" 
          className="mt-2 self-start"
          onClick={onRetry}
        >
          Retry loading images
        </Button>
      </AlertDescription>
    </Alert>
  );
};

export default GalleryErrorState;
