
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Users,
  BarChart,
  Settings,
  LogOut,
  Menu,
  X,
  Database,
  Clock,
  Shield
} from "lucide-react";
import { ADMIN_CREDENTIALS } from "./AdminConstants";

interface AdminSidebarProps {
  signOut: () => Promise<void>;
}

export const AdminSidebar = ({ signOut }: AdminSidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const isActiveRoute = (route: string) => {
    return location.hash === route || location.hash === "" && route === "#dashboard";
  };
  
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="h-5 w-5" />, notifications: 0 },
    { id: "users", label: "Users", icon: <Users className="h-5 w-5" />, notifications: 3 },
    { id: "statistics", label: "Statistics", icon: <BarChart className="h-5 w-5" />, notifications: 0 },
    { id: "system", label: "System", icon: <Database className="h-5 w-5" />, notifications: 1 },
    { id: "activity", label: "Activity Log", icon: <Clock className="h-5 w-5" />, notifications: 0 },
    { id: "settings", label: "Settings", icon: <Settings className="h-5 w-5" />, notifications: 0 },
  ];
  
  const sidebarContent = (
    <>
      <div className={`${collapsed ? "p-3" : "p-5"} border-b`}>
        {collapsed ? (
          <div className="flex justify-center">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Shield className="h-6 w-6 text-primary mr-2" />
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-200">Admin Portal</h1>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:flex hidden" 
                onClick={toggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                className="lg:hidden flex" 
                onClick={toggleMobileSidebar}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Dev Mode: {ADMIN_CREDENTIALS.username}</p>
          </>
        )}
      </div>
      
      <div className="py-4">
        <nav className="space-y-1 px-2">
          {navItems.map((item) => (
            <TooltipProvider key={item.id} delayDuration={collapsed ? 100 : 1000}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link to={`#${item.id}`} className="block">
                    <Button 
                      variant={isActiveRoute(`#${item.id}`) ? "default" : "ghost"} 
                      className={`w-full justify-${collapsed ? "center" : "start"} relative`}
                    >
                      <span className={`${collapsed ? "" : "mr-3"}`}>{item.icon}</span>
                      {!collapsed && <span>{item.label}</span>}
                      {item.notifications > 0 && (
                        <Badge variant="destructive" className={`${collapsed ? "absolute top-1 right-1" : "ml-auto"}`}>
                          {item.notifications}
                        </Badge>
                      )}
                    </Button>
                  </Link>
                </TooltipTrigger>
                {collapsed && (
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          ))}
        </nav>
      </div>
      
      <div className={`absolute bottom-5 ${collapsed ? "w-16 px-2" : "w-[calc(100%-2.5rem)]"}`}>
        <Button 
          variant="outline" 
          onClick={signOut} 
          className="w-full"
        >
          <LogOut className={`h-5 w-5 ${collapsed ? "" : "mr-2"}`} />
          {!collapsed && "Back to Home"}
        </Button>
      </div>
    </>
  );
  
  return (
    <>
      {/* Mobile sidebar toggle button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button 
          variant="outline" 
          size="icon"
          className="rounded-full shadow-md bg-white dark:bg-gray-800"
          onClick={toggleMobileSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      
      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={toggleMobileSidebar}
        ></div>
      )}
      
      {/* Desktop sidebar */}
      <div 
        className={`hidden lg:block bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen ${
          collapsed ? "w-16" : "w-64"
        } fixed transition-all duration-300 z-30`}
      >
        {sidebarContent}
      </div>
      
      {/* Mobile sidebar */}
      <div 
        className={`lg:hidden fixed top-0 left-0 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-screen z-50 transform ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300`}
      >
        {sidebarContent}
      </div>
      
      {/* Content margin for desktop */}
      <div className={`hidden lg:block ${collapsed ? "ml-16" : "ml-64"}`}></div>
    </>
  );
};
