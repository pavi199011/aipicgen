
import { motion } from "framer-motion";
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
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ImageIcon, Settings, Home, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useIsMobile } from "@/hooks/use-mobile";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const menuItems = [
    {
      title: "Dashboard",
      icon: Home,
      onClick: () => navigate("/dashboard"),
    },
    {
      title: "Profile",
      icon: User,
      onClick: () => navigate("/profile"),
    },
  ];

  const getUserInitials = () => {
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50 dark:bg-gray-900">
        <Sidebar>
          <SidebarHeader className={`${isMobile ? "p-3" : "p-4"}`}>
            <div className="flex items-center gap-2">
              <ImageIcon className="h-6 w-6 text-purple-600" />
              <span className="font-bold text-lg">PixelPalette</span>
            </div>
          </SidebarHeader>
          
          <SidebarContent>
            <div className={`mb-4 ${isMobile ? "px-3" : "px-4"}`}>
              <div className="flex items-center p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                <Avatar className="h-8 w-8 md:h-10 md:w-10">
                  <AvatarImage src={user?.avatarUrl} />
                  <AvatarFallback>{getUserInitials()}</AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="text-sm font-medium truncate max-w-[140px]">{user?.email}</p>
                  <p className="text-xs text-muted-foreground">Creator</p>
                </div>
              </div>
            </div>
            
            <SidebarGroup>
              <SidebarGroupLabel>Menu</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {menuItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton onClick={item.onClick} tooltip={item.title}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          
          <SidebarFooter className={`${isMobile ? "p-3" : "p-4"} space-y-2`}>
            <ThemeToggle />
            <button
              onClick={signOut}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
            >
              <LogOut className="h-4 w-4" />
              <span>Sign Out</span>
            </button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 overflow-hidden flex flex-col">
          <header className="bg-white dark:bg-gray-800 border-b dark:border-gray-700 sticky top-0 z-10">
            <div className={`${isMobile ? "px-3 py-2" : "px-4 py-3"} flex justify-between items-center`}>
              <SidebarTrigger />
              <div className="flex items-center gap-4">
                <ThemeToggle />
              </div>
            </div>
          </header>

          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`${isMobile ? "p-3" : "p-6"} overflow-auto flex-1`}
          >
            {children}
          </motion.main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;
