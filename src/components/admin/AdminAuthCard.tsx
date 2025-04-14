
import { ReactNode } from "react";
import { Card } from "@/components/ui/card";

interface AdminAuthCardProps {
  children: ReactNode;
  className?: string;
}

export const AdminAuthCard = ({ children, className = "" }: AdminAuthCardProps) => {
  return (
    <Card className={`border-0 shadow-xl overflow-hidden bg-white dark:bg-gray-800 ${className}`}>
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
      {children}
    </Card>
  );
};
