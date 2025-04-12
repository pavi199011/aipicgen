
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

interface DashboardHeaderProps {
  user: {
    email: string;
    id: string;
  };
  signOut: () => void;
}

const DashboardHeader = ({ user, signOut }: DashboardHeaderProps) => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto py-4 px-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
            PixelPalette
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <span className="text-sm text-gray-600 mr-2">
              Signed in as <span className="font-medium">{user.email}</span>
            </span>
          </div>
          <Button onClick={signOut} variant="outline" size="sm">
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
};

export default DashboardHeader;
