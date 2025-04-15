
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AdminsOverview } from "./admin-management/AdminsOverview";
import { AddAdminForm } from "./admin-management/AddAdminForm";
import { ChangePasswordForm } from "./admin-management/ChangePasswordForm";

interface AdminManagementProps {
  currentAdmins: { id: string; email?: string; username?: string; }[];
  onAddAdmin?: (email: string, password: string) => Promise<void>;
}

export function AdminManagement({ currentAdmins, onAddAdmin }: AdminManagementProps) {
  return (
    <div className="space-y-8">
      <AdminsOverview currentAdmins={currentAdmins} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Add New Admin</CardTitle>
            <CardDescription>Create a new administrator account</CardDescription>
          </CardHeader>
          <CardContent>
            <AddAdminForm onAddAdmin={onAddAdmin} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Admin Password</CardTitle>
            <CardDescription>Update your administrator password</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
