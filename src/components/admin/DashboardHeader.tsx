
import { useState } from "react";
import { Bell, Search, Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ADMIN_CREDENTIALS } from "./AdminConstants";

interface DashboardHeaderProps {
  toggleTheme: () => void;
  isDarkMode: boolean;
}

export const DashboardHeader = ({ toggleTheme, isDarkMode }: DashboardHeaderProps) => {
  const [notifications] = useState(4);
  
  return (
    <header className="sticky top-0 z-20 bg-background border-b px-6 py-3 flex items-center justify-between">
      <div className="lg:w-72 w-full relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search..."
          className="w-full pl-8 h-9"
        />
      </div>
      
      <div className="flex items-center space-x-3">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full"
          onClick={toggleTheme}
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        
        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full"
            asChild
          >
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Bell className="h-4 w-4" />
                {notifications > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-[10px]"
                  >
                    {notifications}
                  </Badge>
                )}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-72">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <div className="max-h-80 overflow-y-auto">
                  <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                    <span className="font-medium">New user registered</span>
                    <span className="text-xs text-muted-foreground">2 min ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                    <span className="font-medium">System alert: Database usage at 80%</span>
                    <span className="text-xs text-muted-foreground">10 min ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                    <span className="font-medium">New login from unusual location</span>
                    <span className="text-xs text-muted-foreground">1 hour ago</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex flex-col items-start cursor-pointer">
                    <span className="font-medium">Weekly report generated</span>
                    <span className="text-xs text-muted-foreground">5 hours ago</span>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="justify-center text-primary cursor-pointer">
                  View all notifications
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </Button>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="rounded-full">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="font-medium text-sm">Admin</p>
                <p className="text-xs text-muted-foreground">{ADMIN_CREDENTIALS.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
