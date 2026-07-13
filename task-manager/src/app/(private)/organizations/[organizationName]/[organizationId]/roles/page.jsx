"use client";

import DeleteConfirmModal from "@/components/layout/DeleteConfirmModal";
import Spinner from "@/components/layout/Spinner";
import ProjectFilters from "@/components/project/ProjectFilters";
import ProjectHeader from "@/components/project/ProjectHeader";
import AddEditRoleModal from "@/components/role/AddEditRoleModal";
import PermissionMatrix from "@/components/role/PermissionMatrix";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import usePermissions from "@/hooks/usePermissions";
import { useGetAllRolesQuery, useArchiveRoleMutation } from "@/redux/services/rolesApi";
import { initialRoleFilters } from "@/utils/constant";
import { Pencil, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

const RolesPage = () => {
  const { hasPermission } = usePermissions();
  const params = useParams();
  const { organizationId } = params;
  const [showCreateEditModal, setShowCreateEditModal] = useState(false);
  const [showPermissionDialog, setShowPermissionDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [formType, setFormType] = useState("create");
  const [filters, setFilters] = useState(initialRoleFilters);

  const { data, isLoading: isRoleLoading, isError: isRoleError } =
    useGetAllRolesQuery({ orgId: organizationId, queryParams: filters },
      { skip: (!hasPermission("role:read") || !organizationId) });

  const [archiveRole, { isLoading: isArchiveLoading }] = useArchiveRoleMutation();

  const handleCreateEditDialog = (type, role) => {
    if (!hasPermission("role:edit")) {
      toast.error("You do not have permission to edit the roles.");
      return;
    }
    setFormType(type);
    setSelectedRole(role)
    setShowCreateEditModal(true);
  };

  const handlePermissionDialog = (role) => {
    setShowPermissionDialog(true);
    setSelectedRole(role);
  }

  const handleDeleteDialog = async (role) => {
    if (!hasPermission("role:archive")) {
      toast.error("You do not have permission to delete roles.");
      return;
    }
    setShowDeleteDialog(true);
    setSelectedRole(role);
  }

  // delete role API Calling
  const handleDeleteRole = async (role, description) => {
    console.log(role, description)
    try {
      const response = await archiveRole({ orgId: organizationId, roleId: role._id, description }).unwrap();
      toast.success(response?.message || "Role deleted successfully!");
      setShowDeleteDialog(false);
      setSelectedRole(null);
    } catch (error) {
      const errorMessage = error?.data?.message || "Failed to delete role.";
      toast.error(errorMessage);
    }
  }

  const rolesData = data?.data;

  return (
    <div className="p-3">
      <ProjectHeader
        pTitle="Roles"
        pDescription="Manage your organization's roles"
        type="roles"
        handleCreateEditDialog={() => handleCreateEditDialog("create")}
        hasPermission={hasPermission}
      />

      <ProjectFilters
        page="roles"
        filters={filters}
        setFilters={setFilters}
        onClearFilters={() => setFilters(initialRoleFilters)}
      />


      {/* role tables */}
      <div className="w-full overflow-x-auto mt-4 rounded-lg border border-gray-200">
        <table className="w-full text-sm border-collapse">
          {/* Standard HTML Table Header */}
          <thead className="bg-gray-100 text-left border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-900 w-50">
                Role Name
              </th>
              <th className="px-4 py-3 font-semibold text-gray-900">
                Role Status
              </th>
              <th className="px-4 py-3 font-semibold text-gray-900">
                Permissions
              </th>
              {(hasPermission("role:edit") || hasPermission("role:archive")) && (
                <th className="px-4 py-3 font-semibold text-gray-900 text-right w-30">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          {/* Standard HTML Table Body */}
          <tbody className="divide-y divide-gray-200">
            {isRoleLoading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  <Spinner text="Loading roles..." />
                </td>
              </tr>
            ) : isRoleError ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-red-500">
                  Something went wrong...!
                </td>
              </tr>
            ) : !rolesData || rolesData.length === 0 ? (
              /* EMPTY STATE */
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-500">
                  No roles found.
                </td>
              </tr>
            ) : (
              /* SUCCESS/DATA STATE */
              rolesData?.map((role) => (
                <tr
                  key={role._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  {/* Role Name */}
                  <td className="px-4 py-3 font-medium text-gray-900">
                    {role.name}
                  </td>

                  {/* Role Status */}
                  <td className="px-4 py-3">
                    <Badge
                      variant={!role.isDeleted ? "default" : "secondary"}
                      className={
                        !role.isDeleted === "active"
                          ? "bg-green-100 text-green-800 hover:bg-green-100 shadow-none"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-100 shadow-none"
                      }
                    >
                      {role.isDeleted ? "Deleted" : "Active"}
                    </Badge>
                  </td>

                  {/* Permissions */}
                  <td className="px-4 py-3 text-gray-600 truncate max-w-75 hover:underline-offset-1 font-bold cursor-pointer" onClick={() => handlePermissionDialog(role)}>
                    Check Permissions
                  </td>

                  {/* Actions (Edit & Delete) */}
                  {(hasPermission("role:edit") || hasPermission("role:archive")) && (
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        {hasPermission("role:edit") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleCreateEditDialog("edit", role)}
                          >
                            <Pencil className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>)}
                        {hasPermission("role:archive") && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDeleteDialog(role)}
                            disabled={isArchiveLoading}
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <AddEditRoleModal
        open={showCreateEditModal}
        setOpen={setShowCreateEditModal}
        selectedRole={selectedRole}
        formType={formType}
      />

      <DeleteConfirmModal
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        isLoading={isArchiveLoading}
        deleteFunction={(description) => handleDeleteRole(selectedRole, description)}
        type="role"
        requireJustification={true}
      />


      {/* Permission Dialog */}
      <Dialog open={showPermissionDialog} onOpenChange={setShowPermissionDialog}>
        <DialogContent className="max-w-[95vw] md:max-w-2xl lg:max-w-3xl max-h-[80vh] p-8 sm:p-7 flex flex-col">
          <DialogHeader className="font-bold text-md md:text-xl">Permissions</DialogHeader>
          <PermissionMatrix activePermissions={selectedRole?.permissions} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RolesPage;
