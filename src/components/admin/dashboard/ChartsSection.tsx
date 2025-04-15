
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserStats } from "./UserStats";
import { ContentStats } from "./ContentStats";
import type { DashboardStats } from "@/types/dashboardStats";

interface ChartsSectionProps {
  stats: DashboardStats;
  period: string;
}

export function ChartsSection({ stats, period }: ChartsSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300 } }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-7"
    >
      <motion.div variants={itemVariants} className="lg:col-span-4">
        <Card className="hover:shadow-md transition-shadow h-full">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>User registration trends over time</CardDescription>
          </CardHeader>
          <CardContent>
            <UserStats data={stats.users} period={period} />
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants} className="lg:col-span-3">
        <Card className="hover:shadow-md transition-shadow h-full">
          <CardHeader>
            <CardTitle>Content Distribution</CardTitle>
            <CardDescription>Types of content being created</CardDescription>
          </CardHeader>
          <CardContent>
            <ContentStats data={stats.content} />
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
