
import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

interface AuthCardProps {
  children: ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <Card className="border-0 shadow-lg">
          {children}
        </Card>
      </motion.div>
    </div>
  );
};
