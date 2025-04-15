
import { ReactNode } from "react";
import { Table } from "@/components/ui/table";

interface UserTableContainerProps {
  children: ReactNode;
}

const UserTableContainer = ({ children }: UserTableContainerProps) => (
  <div className="border rounded-md">
    <Table>{children}</Table>
  </div>
);

export default UserTableContainer;
