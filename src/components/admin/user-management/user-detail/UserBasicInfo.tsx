
import { UserDetailData } from "@/types/admin";
import { Mail } from "lucide-react";

interface UserBasicInfoProps {
  user: UserDetailData;
}

const UserBasicInfo = ({ user }: UserBasicInfoProps) => {
  return (
    <div className="flex-1 text-center sm:text-left">
      <h3 className="text-xl font-semibold">{user.username || "Anonymous"}</h3>
      {user.email && (
        <div className="flex items-center mt-1 text-gray-500">
          <Mail className="h-4 w-4 mr-1" />
          <a href={`mailto:${user.email}`} className="hover:underline">{user.email}</a>
        </div>
      )}
      {user.full_name && <p className="mt-1">{user.full_name}</p>}
      <div className="mt-2 flex flex-wrap justify-center sm:justify-start gap-2">
        {user.is_admin && (
          <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded">
            Admin
          </span>
        )}
        <span className={`text-xs px-2.5 py-0.5 rounded ${
          !user.is_active 
            ? "bg-red-100 text-red-800" 
            : "bg-green-100 text-green-800"
        }`}>
          {user.is_active === false ? "Inactive" : "Active"}
        </span>
      </div>
    </div>
  );
};

export default UserBasicInfo;
