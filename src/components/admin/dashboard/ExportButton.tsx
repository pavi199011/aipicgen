
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DownloadCloud, FileText, Loader2 } from "lucide-react";
import { exportDashboardStats } from "@/utils/admin/exportToCSV";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import type { DashboardStats } from "@/types/dashboardStats";

interface ExportButtonProps {
  stats: DashboardStats | null;
  selectedPeriod: string;
}

export function ExportButton({ stats, selectedPeriod }: ExportButtonProps) {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = (exportType: string) => {
    if (!stats) {
      toast({
        title: "No data to export",
        description: "There's currently no data available to export.",
        variant: "destructive",
      });
      return;
    }

    setIsExporting(true);

    try {
      // Add a small delay to show loading state
      setTimeout(() => {
        // Export the data based on the selected type
        if (exportType === "all") {
          exportDashboardStats(stats, selectedPeriod);
        } else if (exportType === "users") {
          // Export only user data
          const userData = stats.users.weeklyRegistrations;
          const usersCSV = userData ? exportDashboardStats(stats, selectedPeriod) : null;
        } else if (exportType === "content") {
          // Export only content data
          const contentData = stats.content.contentTypes;
          const contentCSV = contentData ? exportDashboardStats(stats, selectedPeriod) : null;
        } else if (exportType === "activity") {
          // Export only activity data
          const activityData = stats.activityData;
          const activityCSV = activityData ? exportDashboardStats(stats, selectedPeriod) : null;
        }

        toast({
          title: "Export successful",
          description: "Your data has been exported successfully.",
        });

        setIsExporting(false);
      }, 500);
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting your data.",
        variant: "destructive",
      });
      setIsExporting(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2" disabled={isExporting || !stats}>
          {isExporting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Exporting...
            </>
          ) : (
            <>
              <DownloadCloud className="h-4 w-4" />
              Export Data
            </>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Export Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => handleExport("all")}>
          <FileText className="mr-2 h-4 w-4" />
          Export All Data
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("users")}>
          <FileText className="mr-2 h-4 w-4" />
          Export User Growth
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("content")}>
          <FileText className="mr-2 h-4 w-4" />
          Export Content Distribution
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleExport("activity")}>
          <FileText className="mr-2 h-4 w-4" />
          Export Recent Activity
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
