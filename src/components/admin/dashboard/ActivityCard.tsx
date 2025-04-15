
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityLog } from "./ActivityLog";
import type { ActivityItem } from "@/types/dashboardStats";

interface ActivityCardProps {
  data: ActivityItem[];
}

export function ActivityCard({ data }: ActivityCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions across the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <ActivityLog data={data} />
        </CardContent>
      </Card>
    </motion.div>
  );
}
