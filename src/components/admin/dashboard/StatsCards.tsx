
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Image, TrendingUp, Activity } from "lucide-react";
import type { DashboardStats } from "@/types/dashboardStats";

interface StatsCardsProps {
  stats: DashboardStats;
  selectedPeriod: string;
}

export function StatsCards({ stats, selectedPeriod }: StatsCardsProps) {
  // Animation variants for staggered animations
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
      className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
    >
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.totalUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`font-medium ${stats?.users.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats?.users.growthRate >= 0 ? '+' : ''}{stats?.users.growthRate || 0}%
              </span> from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Images</CardTitle>
            <Image className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.content.totalImages || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`font-medium ${stats?.content.growthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats?.content.growthRate >= 0 ? '+' : ''}{stats?.content.growthRate || 0}%
              </span> from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.content.conversionRate || 0}%</div>
            <p className="text-xs text-muted-foreground">
              <span className={`font-medium ${stats?.content.conversionGrowth >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats?.content.conversionGrowth >= 0 ? '+' : ''}{stats?.content.conversionGrowth || 0}%
              </span> from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div variants={itemVariants}>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Activity className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.users.activeUsers || 0}</div>
            <p className="text-xs text-muted-foreground">
              <span className={`font-medium ${stats?.users.activeGrowthRate >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {stats?.users.activeGrowthRate >= 0 ? '+' : ''}{stats?.users.activeGrowthRate || 0}%
              </span> from last {selectedPeriod}
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
