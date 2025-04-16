
import { useState } from "react";
import { useAdminDashboardStats } from "@/hooks/useAdminDashboardStats";
import { DashboardHeader } from "./dashboard/DashboardHeader";
import { DashboardSummary } from "./dashboard/DashboardSummary";
import { ChartsSection } from "./dashboard/ChartsSection";
import { ActivityCard } from "./dashboard/ActivityCard";
import { DashboardLoading } from "./dashboard/DashboardLoading";
import { DashboardError } from "./dashboard/DashboardError";

export function AdminOverview() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const { stats, loading, error } = useAdminDashboardStats(selectedPeriod);
  
  // Render loading state
  if (loading) {
    return <DashboardLoading selectedPeriod={selectedPeriod} setSelectedPeriod={setSelectedPeriod} />;
  }

  // Render error state
  if (error) {
    return <DashboardError error={error} />;
  }

  // Render dashboard with real data
  return (
    <div className="space-y-6">
      <DashboardHeader 
        selectedPeriod={selectedPeriod} 
        setSelectedPeriod={setSelectedPeriod} 
        stats={stats}
      />
      
      {stats && <DashboardSummary stats={stats} selectedPeriod={selectedPeriod} />}
      
      {stats && <ChartsSection stats={stats} period={selectedPeriod} />}
      
      {stats && <ActivityCard data={stats.activityData} />}
    </div>
  );
}
