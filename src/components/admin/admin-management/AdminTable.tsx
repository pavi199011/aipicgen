
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface AdminTableProps {
  admins: { id: string; email?: string; username?: string }[];
  onRemoveAdmin: (adminId: string, adminEmail: string) => Promise<void>;
}

export function AdminTable({ admins, onRemoveAdmin }: AdminTableProps) {
  // Format admin display data
  const displayAdmins = admins.map(admin => ({
    id: admin.id,
    email: admin.email || `${admin.username || 'unknown'}@example.com`,
    username: admin.username
  }));

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Email</TableHead>
          <TableHead>Username</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {displayAdmins.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
              No admin accounts found
            </TableCell>
          </TableRow>
        ) : (
          displayAdmins.map((admin) => (
            <TableRow key={admin.id}>
              <TableCell>{admin.email}</TableCell>
              <TableCell>{admin.username || '-'}</TableCell>
              <TableCell>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={() => onRemoveAdmin(admin.id, admin.email)}
                >
                  <X className="h-4 w-4 mr-1" />
                  Remove Admin
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}
