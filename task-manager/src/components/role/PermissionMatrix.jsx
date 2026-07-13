"use client";

import React, { useMemo, useState } from 'react'
import { Checkbox } from '../ui/checkbox';

// This represents ALL possible permissions available in the system
const AVAILABLE_PERMISSIONS = [
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

const STANDARD_ACTIONS = ["read", "create", "edit", "delete"];
const PERMISSION_NAMES = {
    org: "Organization",
    role: "Roles",
    project: "Project",
    task: "Task",
    member: "Member",
};

const PermissionMatrix = ({ activePermissions, setActivePermissions, lockedPermissions }) => {

    // TOGGLE HANDLER: Adds or removes a permission string from the state array
    const togglePermission = (permissionString) => {
        setActivePermissions(
            (prev) =>
                prev.includes(permissionString)
                    ? prev.filter((p) => p !== permissionString) // Remove if exists
                    : [...prev, permissionString], // Add if missing
        );
    };

    // TABLE LAYOUT: We group the available permissions to render the table nicely
    // We use useMemo so this calculation only happens once.
    const tableSchema = useMemo(() => {
        const schema = {};

        AVAILABLE_PERMISSIONS.forEach((ele) => {
            const firstColon = ele.indexOf(":");
            const resource = ele.substring(0, firstColon);
            const action = ele.substring(firstColon + 1);

            if (!schema[resource]) {
                schema[resource] = { standard: [], custom: [] };
            }

            if (STANDARD_ACTIONS.includes(action)) {
                schema[resource].standard.push(action);
            } else {
                schema[resource].custom.push(action);
            }
        });
        return schema;
    }, []);


    return (
        <div className="w-full overflow-x-auto rounded-lg border border-gray-200">
            <table className="w-full text-sm border-collapse">
                <thead className="text-left border-b bg-muted/50">
                    <tr>
                        <th className="py-3 px-4 w-40 font-semibold">
                            Module
                        </th>
                        {STANDARD_ACTIONS.map((action) => (
                            <th
                                key={action}
                                className="py-3 px-4capitalize font-semibold"
                            >
                                {action}
                            </th>
                        ))}
                        <th className="py-3 px-4 font-semibold">
                            Custom Access
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y">
                    {Object.entries(tableSchema).map(([resource, actions]) => (
                        <tr
                            key={resource}
                            className="hover:bg-muted/20 transition-colors"
                        >
                            <td className="px-4 py-4 text-gray-900 capitalize font-semibold">
                                {PERMISSION_NAMES[resource] || resource}
                            </td>

                            {/* Standard Actions Checkboxes */}
                            {STANDARD_ACTIONS.map((stdAction) => {
                                const permString = `${resource}:${stdAction}`;
                                const isAvailable =
                                    actions.standard.includes(stdAction);
                                const isPermissionDisabled = lockedPermissions.includes(permString)
                                return (
                                    <td key={stdAction} className="px-4 py-4 mx-auto">
                                        {isAvailable ? (
                                            <Checkbox
                                                className="border border-black"
                                                checked={activePermissions.includes(
                                                    permString,
                                                )}
                                                onCheckedChange={() =>
                                                    togglePermission(permString)
                                                }
                                                disabled={isPermissionDisabled}
                                            />
                                        ) : (
                                            <span className="text-gray-700 text-xs italic">N/A</span>
                                        )}
                                    </td>
                                );
                            })}

                            {/* Custom Actions Checkboxes */}
                            <td className="px-4 py-4">
                                <div className="flex flex-wrap flex-col gap-4">
                                    {actions.custom.length > 0 ? (
                                        actions.custom.map((customAction) => {
                                            const permString = `${resource}:${customAction}`;
                                            const isPermissionDisabled = lockedPermissions.includes(permString)
                                            return (
                                                <label
                                                    key={customAction}
                                                    className="flex items-center space-x-2 cursor-pointer"
                                                >
                                                    <Checkbox
                                                        className="border border-black"
                                                        checked={activePermissions.includes(
                                                            permString,
                                                        )}
                                                        onCheckedChange={() =>
                                                            togglePermission(permString)
                                                        }
                                                        disabled={isPermissionDisabled}
                                                    />
                                                    <span className="text-xs font-medium text-gray-800">
                                                        {customAction}
                                                    </span>
                                                </label>
                                            );
                                        })
                                    ) : (
                                        <span className="text-gray-700 text-xs italic">
                                            N/A
                                        </span>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PermissionMatrix;