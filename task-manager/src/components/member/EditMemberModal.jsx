"use client";

import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TabsCompo from "../layout/TabsCompo";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useGetAllRolesQuery } from "@/redux/services/rolesApi";
import usePermissions from "@/hooks/usePermissions";
import toast from "react-hot-toast";
import PermissionMatrix from './../role/PermissionMatrix';
import { useEditMemberMutation } from "@/redux/services/memberApi";

export default function EditMemberModal({ onClose, memberData }) {
  const { hasPermission } = usePermissions();
  const params = useParams();
  const { organizationId } = params;

  const [activeTab, setActiveTab] = useState("General Profile");
  const [selectedRole, setSelectedRole] = useState(memberData?.role?._id || "");
  const [designation, setDesignation] = useState(memberData?.designation || "");
  const [activePermissions, setActivePermissions] = useState(memberData?.role?.permissions || []);

  const { data, isLoading: isRoleLoading } = useGetAllRolesQuery(
    { orgId: organizationId, queryParams: { isDeleted: false } },
    { skip: (!organizationId || !hasPermission("member:edit")) }
  );

  const [editMember, { isLoading: isMemberEditLoading }] = useEditMemberMutation();
  const rolesData = data?.data || [];

  // 1. Find the currently selected role object from the fetched roles
  const currentRoleObj = rolesData.find((r) => r._id === selectedRole) || memberData?.role;
  // 2. Extract its base permissions
  const currentBasePermissions = currentRoleObj?.permissions || [];

  // 3. SINGLE CLEAN useEffect to handle role changes
  useEffect(() => {
    if (!rolesData.length) return;

    if (selectedRole !== memberData?.role?._id) {
      // If a NEW role is selected, set permissions to the NEW role's base permissions
      setActivePermissions([...currentBasePermissions]);
    } else {
      // If the ORIGINAL role is selected, combine original base + original additional
      setActivePermissions([
        ...(memberData?.role?.permissions || []),
        ...(memberData?.additionalPermissions || [])
      ]);
    }
  }, [selectedRole, rolesData, memberData]);


  // 4. SUBMIT HANDLER
  const handleUpdateRole = async () => {
    // Filter out the NEW base role permissions to find only the manually added ones
    const newlyAddedPermissions = activePermissions.filter(
      (perm) => !currentBasePermissions.includes(perm)
    );

    const payload = {
      roleId: selectedRole,
      designation: designation,
      additionalPermissions: newlyAddedPermissions // Ensure backend expects this name
    };

    try {
      const response = await editMember({
        orgId: organizationId,
        invitedmemberId: memberData?._id,
        body: payload
      }).unwrap();

      toast.success(response?.message);
      onClose(); // Close modal on success
    } catch (error) {
      console.log("error", error);
      toast.error(error?.data?.message || "Failed to update member");
    }
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Edit Member Details</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition">
            <X size={20} />
          </button>
        </div>

        {/* Content Area with Tabs */}
        <div className="p-5 flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsCompo tabs={["General Profile", "Role & Access"]} activeTab={activeTab} />

            {/* --- GENERAL DETAILS TAB --- */}
            <TabsContent value="General Profile" className="mt-6 space-y-4">
              <div className="text-sm text-gray-500 mb-4">
                Update the member's basic information here.
              </div>
              <div className="p-4 border-2 border-dashed border-gray-200 rounded-xl">
                <div>
                  <label className="text-sm font-medium mb-1 block text-black">
                    Designation
                  </label>
                  {/* FIXED INPUT BUGS HERE */}
                  <input
                    type="text"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full border rounded-lg h-10 px-3 outline-none focus:border-black text-sm"
                    placeholder="Frontend developer, Backend developer, etc."
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                {/* FIXED BUTTON ONCLICK HERE */}
                <Button className="bg-black text-white hover:bg-gray-800" onClick={handleUpdateRole}>
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* --- ROLE UPDATION TAB --- */}
            <TabsContent value="Role & Access" className="mt-6 space-y-4">
              <div className="text-sm text-gray-500 mb-4">
                Modify the member's role and permission levels within the organization.
              </div>

              <div className="mb-6 max-w-sm">
                <Label className="text-black font-semibold mb-2 block text-sm">
                  Select Role
                </Label>
                {/* SIMPLIFIED SELECT HANDLER */}
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger className="w-full h-10 border rounded-lg px-3 text-sm">
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {rolesData.map((role) => (
                        <SelectItem key={role._id} value={role._id}>
                          {role.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>

              {/* Permissions Matrix */}
              <PermissionMatrix
                activePermissions={activePermissions}
                setActivePermissions={setActivePermissions}
                lockedPermissions={currentBasePermissions} // Optional: Pass this down to lock base checkboxes!
              />

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={onClose}>Cancel</Button>
                <Button
                  onClick={handleUpdateRole}
                  className="bg-black text-white hover:bg-gray-800"
                  disabled={isMemberEditLoading}
                >
                  {isMemberEditLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isMemberEditLoading ? 'Updating Member Access' : 'Update Member Access'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}