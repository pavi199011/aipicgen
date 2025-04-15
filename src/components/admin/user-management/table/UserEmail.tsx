
import { ReactNode } from "react";

interface UserEmailProps {
  email: string | null | undefined;
}

const UserEmail = ({ email }: UserEmailProps) => {
  if (typeof email === 'string') {
    return <span>{email}</span>;
  }
  
  return (
    <span>
      Email not available
      <span className="text-xs text-red-500 ml-1">(missing)</span>
    </span>
  );
};

export default UserEmail;
