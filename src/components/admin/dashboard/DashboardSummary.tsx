
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Users, Images, Target, Activity } from "lucide-react";
import type { DashboardStats } from "@/types/dashboardStats";

interface DashboardSummaryProps {
  stats: DashboardStats;
  selectedPeriod: string;
}

export function DashboardSummary({ stats, selectedPeriod }: DashboardSummaryProps) {
  // Format numbers with commas
  const formatNumber = (num: number) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Define metrics to display
  const metrics = [
    {
      title: "Users",
      value: formatNumber(stats.users.totalUsers),
      change: stats.users.growthRate,
      icon: <Users className="h-5 w-5 text-purple-600" />,
      color: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-200 dark:border-purple-800",
    },
    {
      title: "Active Users",
      value: formatNumber(stats.users.activeUsers),
      change: stats.users.activeGrowthRate,
      icon: <Activity className="h-5 w-5 text-orange-500" />,
      color: "bg-orange-50 dark:bg-orange-900/20",
      border: "border-orange-200 dark:border-orange-800",
    },
    {
      title: "Images",
      value: formatNumber(stats.content.totalImages),
      change: stats.content.growthRate,
      icon: <Images className="h-5 w-5 text-blue-500" />,
      color: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-200 dark:border-blue-800",
    },
    {
      title: "Conversion",
      value: `${stats.content.conversionRate}%`,
      change: stats.content.conversionGrowth,
      icon: <Target className="h-5 w-5 text-green-500" />,
      color: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-6"
    >
      <Card className="border-0 bg-transparent shadow-none">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index, duration: 0.4 }}
              >
                <Card className={`border ${metric.border} hover:shadow-md transition-shadow`}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className={`rounded-full p-2 ${metric.color}`}>
                        {metric.icon}
                      </div>
                      <Badge variant={metric.change >= 0 ? "default" : "destructive"} className="font-medium">
                        {metric.change >= 0 ? "+" : ""}{metric.change.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="mt-3">
                      <p className="text-sm font-medium text-muted-foreground">{metric.title}</p>
                      <h3 className="text-2xl font-bold tracking-tight">{metric.value}</h3>
                      <p className="text-xs text-muted-foreground mt-1">
                        {metric.change >= 0 ? (
                          <span className="flex items-center text-green-600">
                            <TrendingUp className="mr-1 h-3 w-3" /> Up from last {selectedPeriod}
                          </span>
                        ) : (
                          <span className="flex items-center text-red-600">
                            <TrendingDown className="mr-1 h-3 w-3" /> Down from last {selectedPeriod}
                          </span>
                        )}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
