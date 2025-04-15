
import { format } from "date-fns";
import { motion } from "framer-motion";
import { 
  User, 
  ImagePlus, 
  UserPlus, 
  Settings, 
  Lock,
  CheckCircle,
  AlertTriangle,
  Clock
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatarUrl?: string;
  };
  action: string;
  target?: string;
  timestamp: string;
  type: "login" | "content" | "registration" | "settings" | "admin";
  status?: "success" | "warning" | "pending";
}

interface ActivityLogProps {
  data: ActivityItem[];
}

const getActivityIcon = (type: string, status?: string) => {
  switch (type) {
    case "login":
      return <Lock className="h-4 w-4 text-blue-500" />;
    case "content":
      return <ImagePlus className="h-4 w-4 text-green-500" />;
    case "registration":
      return <UserPlus className="h-4 w-4 text-purple-500" />;
    case "settings":
      return <Settings className="h-4 w-4 text-orange-500" />;
    case "admin":
      return <User className="h-4 w-4 text-red-500" />;
    default:
      if (status === "warning") return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      if (status === "pending") return <Clock className="h-4 w-4 text-blue-500" />;
      return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
};

const getStatusBadge = (status?: string) => {
  if (!status) return null;
  
  switch (status) {
    case "success":
      return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Success</Badge>;
    case "warning":
      return <Badge variant="outline" className="bg-amber-100 text-amber-800 border-amber-200">Warning</Badge>;
    case "pending":
      return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Pending</Badge>;
    default:
      return null;
  }
};

export function ActivityLog({ data }: ActivityLogProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center p-6 text-gray-500">
        No recent activity found.
      </div>
    );
  }
  
  return (
    <div className="space-y-4 max-h-96 overflow-auto pr-2">
      {data.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
        >
          <div className="flex-shrink-0 mt-1">
            {getActivityIcon(item.type, item.status)}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={item.user.avatarUrl} alt={item.user.name} />
                  <AvatarFallback>{item.user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="font-medium text-sm">{item.user.name}</span>
              </div>
              
              <div className="flex items-center gap-2">
                {getStatusBadge(item.status)}
                <span className="text-xs text-gray-500">
                  {format(new Date(item.timestamp), "MMM d, p")}
                </span>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 dark:text-gray-300">
              {item.action}
              {item.target && <span className="font-medium"> {item.target}</span>}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
