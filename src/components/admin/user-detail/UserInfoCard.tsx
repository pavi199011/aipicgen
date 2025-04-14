
import { Card, CardContent } from "@/components/ui/card";
import { User, UserIcon, Calendar, Image } from "lucide-react";

interface UserInfoCardProps {
  id: string;
  created_at: string;
  imageCount: number;
}

export const UserInfoCard = ({ id, created_at, imageCount }: UserInfoCardProps) => {
  // Format date for better readability
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center space-x-2">
          <UserIcon className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">User ID:</span>
          <span className="text-sm text-muted-foreground truncate max-w-[200px]">
            {id}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Created:</span>
          <span className="text-sm text-muted-foreground">
            {formatDate(created_at)}
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <Image className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Images Generated:</span>
          <span className="text-sm text-muted-foreground">
            {imageCount}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
