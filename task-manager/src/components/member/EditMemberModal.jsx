"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import TabsCompo from "../layout/TabsCompo";

const ROLES = [
  { key: "owner", label: "Owner" },
  { key: "admin", label: "Admin" },
  { key: "employee", label: "Employee" },
  { key: "guest", label: "Guest" },
];
const array = [
  "org:read",
  "org:create",
  "org:edit",
  "org:delete",
  "org:general:edit",
  "org:security:edit",
  "org:billing:view",
  "org:billing:manage",
  "role:read",
  "role:create",
  "role:edit",
  "role:archive",
  "project:create",
  "project:read",
  "project:edit",
  "project:delete",
  "task:create",
  "task:read",
  "task:edit",
  "task:delete",
  "member:read",
  "member:create",
  "member:edit",
  "member:delete",
  "member:cancel",
  "member:revoked",
];

export default function EditMemberModal({ onClose, memberData }) {
  // You can adjust these tab names to whatever you prefer
  const [activeTab, setActiveTab] = useState("General Profile");
  const [form, setForm] = useState({
    Designation: "",
  });

  const makePermissionLayout = () => {
    permissionState = {};
    const STANDARD_ACTIONS = ["create", "read", "edit", "delete"];
    array.forEach((ele) => {
      const firstColon = ele.indexOf(":");
      const resource = ele.substring(0, firstColon);
      const action = ele.substring(firstColon + 1);

      if (!permissionState[resource]) {
        permissionState[resource] = {
          create: false,
          read: false,
          edit: false,
          delete: false,
          custom: {},
        };
      }

      if (STANDARD_ACTIONS.includes(action)) {
        permissionState[resource][action] = true;
      } else {
        permissionState[resource].custom[action] = true;
      }
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Edit Member Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content Area with Tabs */}
        <div className="p-5 flex-1 overflow-y-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Custom Tab Header Component */}
            <TabsCompo
              tabs={["General Profile", "Role & Access"]}
              activeTab={activeTab}
            />

            {/* --- GENERAL DETAILS TAB --- */}
            <TabsContent value="General Profile" className="mt-6 space-y-4">
              <div className="text-sm text-gray-500 mb-4">
                Update the member's basic information here.
              </div>

              {/* TODO: Add your Name, Email, Designation, etc. form fields here */}
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">
                [ General Details Form Goes Here ]
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800">
                  Save Changes
                </Button>
              </div>
            </TabsContent>

            {/* --- ROLE UPDATION TAB --- */}
            <TabsContent value="Role & Access" className="mt-6 space-y-4">
              <div className="text-sm text-gray-500 mb-4">
                Modify the member's role and permission levels within the
                organization.
              </div>

              {/* TODO: Add your Role dropdown/radio buttons here */}
              <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center text-gray-400">
                [ Role Updation Form Goes Here ]
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="bg-black text-white hover:bg-gray-800">
                  Update Role
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
