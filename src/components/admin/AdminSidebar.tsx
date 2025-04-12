
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  BarChart,
  Settings,
  LogOut
} from "lucide-react";

interface AdminSidebarProps {
  signOut: () => void;
}

export const AdminSidebar = ({ signOut }: AdminSidebarProps) => {
  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen p-5">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-sm text-gray-500">Management Panel</p>
      </div>
      
      <nav className="space-y-2">
        <Button variant="ghost" className="w-full justify-start" asChild>
          <a href="#dashboard">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Dashboard
          </a>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <a href="#users">
            <Users className="mr-2 h-4 w-4" />
            Users
          </a>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <a href="#statistics">
            <BarChart className="mr-2 h-4 w-4" />
            Statistics
          </a>
        </Button>
        <Button variant="ghost" className="w-full justify-start" asChild>
          <a href="#settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </a>
        </Button>
      </nav>
      
      <div className="absolute bottom-5 w-52">
        <Button variant="outline" onClick={signOut} className="w-full">
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
};
