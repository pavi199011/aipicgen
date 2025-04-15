
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportButton } from "./ExportButton";
import type { DashboardStats } from "@/types/dashboardStats";

interface DashboardHeaderProps {
  selectedPeriod: string;
  setSelectedPeriod: (period: string) => void;
  stats?: DashboardStats | null;
}

export function DashboardHeader({ 
  selectedPeriod, 
  setSelectedPeriod,
  stats = null 
}: DashboardHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your admin dashboard, view and export analytics.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <ExportButton stats={stats} selectedPeriod={selectedPeriod} />
        </div>
      </div>
      
      <Card className="bg-white dark:bg-slate-800">
        <CardContent className="pt-6">
          <Tabs defaultValue={selectedPeriod} className="w-full" onValueChange={setSelectedPeriod}>
            <TabsList className="grid grid-cols-4 w-full max-w-md mx-auto">
              <TabsTrigger value="day">Day</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
              <TabsTrigger value="year">Year</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
