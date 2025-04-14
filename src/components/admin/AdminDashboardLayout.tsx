
import { ReactNode } from "react";
import { DevelopmentModeAlert } from "@/components/admin/DevelopmentModeAlert";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";

interface AdminDashboardLayoutProps {
  children: ReactNode;
  signOut: () => void;
  currentTab: string;
  isDarkMode: boolean;
  toggleTheme: () => void;
  onHeaderAction: (action: string) => void;
}

export const AdminDashboardLayout = ({
  children,
  signOut,
  currentTab,
  isDarkMode,
  toggleTheme,
  onHeaderAction
}: AdminDashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DevelopmentModeAlert />
      
      <div className="flex">
        <AdminSidebar signOut={signOut} currentTab={currentTab} />
        
        <div className="flex-1 lg:ml-64">
          <DashboardHeader 
            toggleTheme={toggleTheme} 
            isDarkMode={isDarkMode} 
            onAction={onHeaderAction}
          />
          
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
