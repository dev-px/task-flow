"use client";

import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '../ui/dialog';
import PermissionMatrix from './PermissionMatrix';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import toast from 'react-hot-toast';
import { useCreateRoleMutation, useEditRoleMutation } from '@/redux/services/rolesApi';
import { useParams } from 'next/navigation';
import Spinner from '../layout/Spinner';
import { Loader2 } from 'lucide-react';

const AddEditRoleModal = ({ open, setOpen, selectedRole, formType }) => {
    const params = useParams();
    const { organizationId } = params;
    const [form, setForm] = useState({
        name: "",
        description: ""
    });
    const [errors, setErrors] = useState({});
    const [activePermissions, setActivePermissions] = useState([]);

    // for creating role
    const [createRole, { isLoading: isCreating }] = useCreateRoleMutation();
    const [editRole, { isLoading: isEditing }] = useEditRoleMutation();
    const isRoleSaving = isCreating || isEditing;

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    const handleCloseForm = () => {
        setOpen(false);
        setForm({
            name: "",
            description: ""
        });
        setActivePermissions([]);
    }

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            // Add submit logic here
            console.log("form submitted", form, activePermissions)
            let response;
            if (formType === "edit") {
                response = await editRole({ orgId: organizationId, roleId: selectedRole._id, data: { ...form, permissions: activePermissions } }).unwrap();
            } else {
                response = await createRole({ orgId: organizationId, data: { ...form, permissions: activePermissions } }).unwrap();
            }
            toast.success(response?.message);
            handleCloseForm();
        } catch (error) {
            setErrors(error?.data?.errors);
            toast.error(error?.data?.message || "Failed to save role. Please try again.");
        }
    }

    useEffect(() => {
        if (formType === "edit" && selectedRole) {
            setForm({
                name: selectedRole.name || "",
                description: selectedRole.description || ""
            })
            setActivePermissions(selectedRole.permissions || []);
        }
    }, [selectedRole, formType])

    const buttonDisabled = isRoleSaving || !form.name.trim() || !form.description.trim() || activePermissions.length === 0;

    return (
        <Dialog open={open} onOpenChange={handleCloseForm}>
            <DialogContent className="max-w-[95vw] md:max-w-2xl lg:max-w-4xl max-h-[90vh] p-4 sm:p-6 flex flex-col">
                {/* HEADER */}
                <DialogHeader>
                    <DialogTitle className="flex items-center font-bold gap-2 text-lg sm:text-xl">
                        {formType.charAt(0).toUpperCase() + formType.slice(1)} Role
                    </DialogTitle>
                    <DialogDescription className="text-sm">
                        {formType === "create"
                            ? "Fill in the details below to create a new role."
                            : "Modify the details of the existing role."}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto pr-1">
                    <form id="role-form" onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 mt-2">
                        {/* Role Name */}
                        <div className="space-y-2">
                            <Label htmlFor="role-name">Role Name</Label>
                            <Input
                                id="role-name"
                                placeholder="e.g. Admin, Editor, Viewer"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                required
                            />
                            {errors?.name && <p className="text-sm text-red-500">{errors?.name}</p>}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="role-desc">Description</Label>
                            <Textarea
                                id="role-desc"
                                placeholder="Brief about the role..."
                                value={form.description}
                                onChange={(e) => handleChange("description", e.target.value)}
                                rows={3}
                                required
                            />
                            {errors?.description && <p className="text-sm text-red-500">{errors?.description}</p>}
                        </div>

                        {/* Permission Matrix */}
                        <div className="space-y-2">
                            <Label>Permissions</Label>
                            {/* overflow-x-auto allows the table to swipe left/right on mobile */}
                            <div className="w-full overflow-x-auto border rounded-lg">
                                <div className="min-w-150"> {/* Forces scroll if screen is too small */}
                                    <PermissionMatrix activePermissions={activePermissions} setActivePermissions={setActivePermissions} />
                                </div>
                            </div>
                            {errors?.permissions && <p className="text-sm text-red-500">{errors?.permissions}</p>}
                        </div>
                    </form>
                </div>

                {/* FOOTER */}
                <DialogFooter className="mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 pt-4 border-t">
                    <DialogClose asChild>
                        <Button variant="outline" type="button" className="w-full sm:w-auto cursor-pointer">
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        form="role-form"
                        className={`w-full sm:w-auto cursor-pointer ${isRoleSaving ? 'cursor-not-allowed opacity-70' : ""}`}
                       
                    >
                        {isRoleSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}

                        {isRoleSaving
                            ? (formType === "edit" ? "Updating..." : "Creating...")
                            : (formType === "edit" ? "Update Role" : "Create Role")
                        }
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddEditRoleModal;