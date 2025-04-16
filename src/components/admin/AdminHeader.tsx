
import { AuthUser } from "@/contexts/auth";
import { useAuth } from "@/contexts/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { LogOut, User, Settings, Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/theme-toggle";

interface AdminHeaderProps {
  user: AuthUser;
}

const AdminHeader = ({ user }: AdminHeaderProps) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  
  const getUserInitials = () => {
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    }
    if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "A";
  };

  return (
    <header className="bg-purple-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 
            className="text-2xl font-bold text-white cursor-pointer"
            onClick={() => navigate('/admin')}
          >
            Admin Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          <div className="hidden md:flex">
            <span className="text-sm text-gray-200 mr-2">
              Signed in as <span className="font-medium">{user.email || user.username || "Admin"}</span>
            </span>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-9 w-9 p-0 bg-purple-800 hover:bg-purple-700">
                <Avatar className="h-9 w-9 border-2 border-purple-300">
                  <AvatarImage src={user.avatarUrl || ""} alt={user.username || "Admin"} />
                  <AvatarFallback className="bg-purple-700">{getUserInitials()}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                <Home className="mr-2 h-4 w-4" />
                User Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <User className="mr-2 h-4 w-4" />
                Profile
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
