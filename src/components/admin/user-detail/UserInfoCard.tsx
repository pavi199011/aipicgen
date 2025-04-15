
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Hash, Image, Mail, User } from "lucide-react";

interface UserInfoCardProps {
  id: string;
  created_at: string;
  imageCount: number;
  email?: string;
  full_name?: string;
}

export const UserInfoCard = ({ id, created_at, imageCount, email, full_name }: UserInfoCardProps) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        {full_name && (
          <div className="flex items-start space-x-2">
            <User className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Full Name</p>
              <p className="text-sm text-muted-foreground break-all">{full_name}</p>
            </div>
          </div>
        )}
        
        {email && (
          <div className="flex items-start space-x-2">
            <Mail className="h-4 w-4 text-muted-foreground mt-0.5" />
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground break-all">{email}</p>
            </div>
          </div>
        )}
        
        <div className="flex items-start space-x-2">
          <Hash className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">User ID</p>
            <p className="text-sm text-muted-foreground break-all">{id}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Joined</p>
            <p className="text-sm text-muted-foreground">{formatDate(created_at)}</p>
          </div>
        </div>
        
        <div className="flex items-start space-x-2">
          <Image className="h-4 w-4 text-muted-foreground mt-0.5" />
          <div>
            <p className="text-sm font-medium">Images Generated</p>
            <p className="text-sm text-muted-foreground">{imageCount}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
