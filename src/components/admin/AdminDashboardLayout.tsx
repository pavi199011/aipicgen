
import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/admin/DashboardHeader";
import { cn } from "@/lib/utils";

interface AdminDashboardLayoutProps {
  children: ReactNode;
  signOut: () => Promise<void>;
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
      <div className="flex">
        <AdminSidebar signOut={signOut} currentTab={currentTab} />
        
        <MainContentArea 
          toggleTheme={toggleTheme} 
          isDarkMode={isDarkMode} 
          onHeaderAction={onHeaderAction}
        >
          {children}
        </MainContentArea>
      </div>
    </div>
  );
};

interface MainContentAreaProps {
  children: ReactNode;
  toggleTheme: () => void;
  isDarkMode: boolean;
  onHeaderAction: (action: string) => void;
}

const MainContentArea = ({
  children,
  toggleTheme,
  isDarkMode,
  onHeaderAction
}: MainContentAreaProps) => (
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
);
