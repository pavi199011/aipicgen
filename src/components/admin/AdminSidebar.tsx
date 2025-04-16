
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/auth";
import { motion } from "framer-motion";
import { 
  BarChart3, 
  Users, 
  Settings, 
  Home, 
  Image,
  LogOut, 
  Shield, 
  Activity
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AdminSidebar() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Determine active section based on current route
  const getActiveSection = (path: string) => {
    if (path === "/admin") return "overview";
    if (path.startsWith("/admin/users")) return "users";
    if (path.startsWith("/admin/content")) return "content";
    if (path.startsWith("/admin/analytics")) return "analytics";
    if (path.startsWith("/admin/activity")) return "activity";
    if (path.startsWith("/admin/settings")) return "settings";
    return "overview";
  };
  
  const [activeSection, setActiveSection] = useState(getActiveSection(location.pathname));
  
  // Update active section when route changes
  useEffect(() => {
    setActiveSection(getActiveSection(location.pathname));
  }, [location.pathname]);

  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: Home,
      onClick: () => navigate("/admin")
    },
    {
      id: "users",
      label: "User Management",
      icon: Users,
      onClick: () => navigate("/admin/users")
    },
    {
      id: "content",
      label: "Content",
      icon: Image,
      onClick: () => navigate("/admin/content")
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      onClick: () => navigate("/admin/analytics")
    },
    {
      id: "activity",
      label: "Activity Log",
      icon: Activity,
      onClick: () => navigate("/admin/activity")
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      onClick: () => navigate("/admin/settings")
    }
  ];

  const getUserInitials = () => {
    if (user?.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "AD";
  };

  // Handle sign out with proper navigation
  const handleSignOut = async () => {
    await signOut();
    // Redirect to admin login page instead of auth
    navigate("/admin/login");
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-600" />
          <span className="font-bold text-lg">PixelPalette Admin</span>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <div className="mb-4 px-4">
          <div className="flex items-center p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
            <Avatar className="h-10 w-10 border-2 border-purple-300">
              <AvatarImage src={user?.avatarUrl || ""} alt={user?.username || "Admin"} />
              <AvatarFallback className="bg-purple-700 text-white">{getUserInitials()}</AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">{user?.username || user?.email}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
            </div>
          </div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    isActive={activeSection === item.id}
                    onClick={item.onClick}
                    tooltip={item.label}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
