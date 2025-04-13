
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AdminAuthCardProps {
  children: ReactNode;
  className?: string;
}

export const AdminAuthCard = ({ children, className = "" }: AdminAuthCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-950 via-blue-900 to-indigo-900 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className={`w-full max-w-md ${className}`}
      >
        <Card className="border-0 shadow-xl overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"></div>
          {children}
        </Card>
      </motion.div>
    </div>
  );
};
