
import { LogIn } from "lucide-react";

export const AdminTestCredentials = () => {
  return (
    <p className="text-sm text-center text-gray-500 w-full mt-6">
      <LogIn className="inline mr-1 h-3 w-3" />
      For testing, use: admin@example.com / SecureAdminPass2025!
    </p>
  );
};
