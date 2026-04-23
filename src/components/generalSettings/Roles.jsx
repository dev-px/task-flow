import { useMemo, useState } from "react";
import { Shield, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SectionCard from "../layout/SectionCard";

export default function RoleSettingsTab() {
  const [roles, setRoles] = useState([
    "admin",
    "projectManager",
    "teamLead",
    "employee",
    "client",
  ]);

  const [newRole, setNewRole] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  const [editedRoleName, setEditedRoleName] = useState("");

  const [roleStatus, setRoleStatus] = useState({
    admin: "active",
    projectManager: "active",
    teamLead: "active",
    employee: "active",
    client: "inactive",
  });

  const permissionLabels = {
    createProject: "Create Projects",
    editProject: "Edit Projects",
    deleteProject: "Delete Projects",
    createTask: "Create Tasks",
    assignTask: "Assign Tasks",
    deleteTask: "Delete Tasks",
    manageUsers: "Manage Team Members",
    changeRoles: "Change User Roles",
    approveRequests: "Approve Requests",
    exportReports: "Export Reports",
    billingAccess: "Billing Access",
    workspaceSettings: "Workspace Settings",
    auditLogs: "View Audit Logs",
  };

  const createDefaultPermissions = () => {
    const base = {};
    Object.keys(permissionLabels).forEach((key) => {
      base[key] = false;
    });
    return base;
  };

  const [rolePermissions, setRolePermissions] = useState({
    admin: {
      ...createDefaultPermissions(),
      createProject: true,
      editProject: true,
      deleteProject: true,
      createTask: true,
      assignTask: true,
      deleteTask: true,
      manageUsers: true,
      changeRoles: true,
      approveRequests: true,
      exportReports: true,
      billingAccess: true,
      workspaceSettings: true,
      auditLogs: true,
    },
    projectManager: {
      ...createDefaultPermissions(),
      createProject: true,
      editProject: true,
      createTask: true,
      assignTask: true,
      manageUsers: true,
      approveRequests: true,
      exportReports: true,
    },
    teamLead: {
      ...createDefaultPermissions(),
      createTask: true,
      assignTask: true,
      approveRequests: true,
    },
    employee: {
      ...createDefaultPermissions(),
      createTask: false,
    },
    client: {
      ...createDefaultPermissions(),
    },
  });

  const [roleHierarchy, setRoleHierarchy] = useState({
    admin: ["projectManager", "teamLead", "employee", "client"],
    projectManager: ["teamLead", "employee"],
    teamLead: ["employee"],
    employee: [],
    client: [],
  });

  const [approvalRules, setApprovalRules] = useState([
    { id: 1, name: "Task Deletion", approver: "admin", enabled: true },
    { id: 2, name: "Leave Request", approver: "projectManager", enabled: true },
    { id: 3, name: "Expense Approval", approver: "admin", enabled: false },
  ]);

  const [auditLogs, setAuditLogs] = useState([
    "Admin updated Project Manager permissions",
    "Admin created custom role: Client",
  ]);

  const addAudit = (message) => {
    setAuditLogs((prev) => [message, ...prev]);
  };

  const togglePermission = (role, permission) => {
    setRolePermissions((prev) => ({
      ...prev,
      [role]: {
        ...prev[role],
        [permission]: !prev[role][permission],
      },
    }));

    addAudit(`${role} permission updated: ${permission}`);
  };

  const toggleHierarchy = (parentRole, childRole) => {
    setRoleHierarchy((prev) => {
      const exists = prev[parentRole]?.includes(childRole);

      const updated = exists
        ? prev[parentRole].filter((r) => r !== childRole)
        : [...(prev[parentRole] || []), childRole];

      return {
        ...prev,
        [parentRole]: updated,
      };
    });

    addAudit(`${parentRole} hierarchy updated for ${childRole}`);
  };

  const toggleApprovalRule = (id) => {
    setApprovalRules((prev) =>
      prev.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule,
      ),
    );
  };

  const handleUpdateRoleName = (oldRole, newRoleName) => {
    const cleanName = newRoleName.trim();
    if (!cleanName || oldRole === cleanName || roles.includes(cleanName))
      return;

    setRoles((prev) =>
      prev.map((role) => (role === oldRole ? cleanName : role)),
    );

    setRolePermissions((prev) => {
      const updated = { ...prev };
      updated[cleanName] = updated[oldRole];
      delete updated[oldRole];
      return updated;
    });

    setRoleHierarchy((prev) => {
      const updated = { ...prev };
      updated[cleanName] = updated[oldRole] || [];
      delete updated[oldRole];

      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].map((item) =>
          item === oldRole ? cleanName : item,
        );
      });

      return updated;
    });

    setRoleStatus((prev) => {
      const updated = { ...prev };
      updated[cleanName] = updated[oldRole] || "active";
      delete updated[oldRole];
      return updated;
    });

    addAudit(`Role renamed from ${oldRole} to ${cleanName}`);
    setEditingRole(null);
    setEditedRoleName("");
  };

  const handleRoleStatusChange = (role, status) => {
    setRoleStatus((prev) => ({
      ...prev,
      [role]: status,
    }));

    addAudit(`${role} marked as ${status}`);
  };

  const handleDeleteRole = (roleToDelete) => {
    if (["admin"].includes(roleToDelete)) return;

    setRoles((prev) => prev.filter((role) => role !== roleToDelete));

    setRolePermissions((prev) => {
      const updated = { ...prev };
      delete updated[roleToDelete];
      return updated;
    });

    setRoleHierarchy((prev) => {
      const updated = { ...prev };
      delete updated[roleToDelete];

      Object.keys(updated).forEach((key) => {
        updated[key] = updated[key].filter((r) => r !== roleToDelete);
      });

      return updated;
    });

    setRoleStatus((prev) => {
      const updated = { ...prev };
      delete updated[roleToDelete];
      return updated;
    });

    addAudit(`Role deleted: ${roleToDelete}`);
  };

  const handleCreateRole = () => {
    const cleanRole = newRole.trim();
    if (!cleanRole || roles.includes(cleanRole)) return;

    setRoles((prev) => [...prev, cleanRole]);
    setRolePermissions((prev) => ({
      ...prev,
      [cleanRole]: createDefaultPermissions(),
    }));
    setRoleHierarchy((prev) => ({
      ...prev,
      [cleanRole]: [],
    }));

    addAudit(`Created custom role: ${cleanRole}`);
    setNewRole("");
  };

  const roleCount = useMemo(() => roles.length, [roles]);

  return (
    <SectionCard title="Roles & Permissions" icon={Shield}>
      <div className="space-y-8">
        {/* CUSTOM ROLE CREATION */}
        <div className="rounded-2xl border p-6 space-y-4">
          <h3 className="text-base font-semibold">Create Custom Role</h3>
          <div className="flex gap-3 max-w-xl">
            <Input
              placeholder="Example: financeManager"
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
            />
            <Button onClick={handleCreateRole}>
              <Plus className="h-4 w-4 mr-2" />
              Add Role
            </Button>
          </div>
        </div>

        {
          /* ROLE MANAGEMENT */
          <div className="rounded-2xl border p-6 space-y-4">
            <h3 className="text-base font-semibold">
              Existing Role Management
            </h3>

            {roles.map((role) => (
              <div
                key={role}
                className="border rounded-xl p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <p className="font-medium capitalize">{role}</p>
                  <p className="text-sm text-muted-foreground">
                    Status: {roleStatus[role] || "active"}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setEditingRole(role);
                      setEditedRoleName(role);
                    }}
                  >
                    Rename
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRoleStatusChange(role, "inactive")}
                  >
                    Inactive
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleRoleStatusChange(role, "archived")}
                  >
                    Archive
                  </Button>

                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteRole(role)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            ))}

            {editingRole && (
              <div className="border rounded-xl p-4 space-y-3">
                <p className="font-medium">Rename Role: {editingRole}</p>
                <div className="flex gap-3 max-w-xl">
                  <Input
                    value={editedRoleName}
                    onChange={(e) => setEditedRoleName(e.target.value)}
                  />
                  <Button
                    onClick={() =>
                      handleUpdateRoleName(editingRole, editedRoleName)
                    }
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>

          /* PERMISSION MATRIX */
        }
        <div className="rounded-2xl border overflow-hidden">
          <div className="p-5 border-b font-semibold">Permission Matrix</div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-275">
              <thead>
                <tr>
                  <th className="p-4 text-left">Permission</th>
                  {roles.map((role) => (
                    <th key={role} className="p-4 text-center capitalize">
                      {role}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Object.entries(permissionLabels).map(([key, label]) => (
                  <tr key={key} className="border-t">
                    <td className="p-4 font-medium">{label}</td>
                    {roles.map((role) => (
                      <td key={role} className="p-4 text-center">
                        <Button
                          size="sm"
                          variant={
                            rolePermissions[role]?.[key] ? "default" : "outline"
                          }
                          onClick={() => togglePermission(role, key)}
                        >
                          {rolePermissions[role]?.[key]
                            ? "Allowed"
                            : "Restricted"}
                        </Button>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ROLE HIERARCHY */}
        <div className="rounded-2xl border p-6 space-y-5">
          <h3 className="text-base font-semibold">Role Assignment Rules</h3>
          {roles.map((parentRole) => (
            <div key={parentRole} className="border rounded-xl p-4">
              <p className="font-medium capitalize mb-4">
                {parentRole} can manage:
              </p>
              <div className="grid gap-3 md:grid-cols-2">
                {roles
                  .filter((child) => child !== parentRole)
                  .map((childRole) => {
                    const enabled =
                      roleHierarchy[parentRole]?.includes(childRole);
                    return (
                      <div
                        key={childRole}
                        className="flex items-center justify-between border rounded-lg p-3"
                      >
                        <span className="capitalize">{childRole}</span>
                        <Button
                          size="sm"
                          variant={enabled ? "default" : "outline"}
                          onClick={() => toggleHierarchy(parentRole, childRole)}
                        >
                          {enabled ? "Allowed" : "Restricted"}
                        </Button>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))}
        </div>

        {/* APPROVAL WORKFLOWS */}
        <div className="rounded-2xl border p-6 space-y-4">
          <h3 className="text-base font-semibold">Approval Workflows</h3>
          {approvalRules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between border rounded-xl p-4"
            >
              <div>
                <p className="font-medium">{rule.name}</p>
                <p className="text-sm text-muted-foreground">
                  Approver: {rule.approver}
                </p>
              </div>
              <Button
                size="sm"
                variant={rule.enabled ? "default" : "outline"}
                onClick={() => toggleApprovalRule(rule.id)}
              >
                {rule.enabled ? "Enabled" : "Disabled"}
              </Button>
            </div>
          ))}
        </div>

        {/* AUDIT LOGS */}
        <div className="rounded-2xl border p-6 space-y-4">
          <h3 className="text-base font-semibold">Audit Logs</h3>
          {auditLogs.map((log, index) => (
            <div key={index} className="border rounded-xl p-4 text-sm">
              {log}
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}
