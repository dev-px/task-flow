"use client";

import { useEffect, useState } from 'react';
import { Trash2, Loader2 } from 'lucide-react';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const DeleteConfirmModal = ({
    open,
    setOpen,
    isLoading,
    deleteFunction,
    type = "item",
    requireJustification = true
}) => {
    const [description, setDescription] = useState("");
    useEffect(() => {
        if (!open) {
            setDescription("");
        }
    }, [open]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        deleteFunction(description);
    };

    // Generate a unique dynamic ID so form binding works on any page
    const formId = `delete-${type.replace(/\s+/g, '-').toLowerCase()}-form`;

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="sm:max-w-md">

                {/* HEADER */}
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-red-600">
                        <Trash2 size={20} />
                        Delete {type}
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this {type.toLowerCase()}? This action is permanent and cannot be undone.
                    </DialogDescription>
                </DialogHeader>

                {/* BODY */}
                <form id={formId} onSubmit={handleSubmit} className="space-y-4 mt-2">
                    {requireJustification && (
                        <div className="space-y-2">
                            <Label htmlFor={`${formId}-justification`}>
                                Reason for deletion <span className="text-red-500">*</span>
                            </Label>
                            <Textarea
                                id={`${formId}-justification`}
                                placeholder={`Briefly explain why you are deleting this ${type.toLowerCase()}...`}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                required={requireJustification}
                                disabled={isLoading}
                            />
                        </div>
                    )}
                </form>

                {/* FOOTER */}
                <DialogFooter className="mt-4 flex flex-col-reverse sm:flex-row gap-2 sm:gap-0 pt-4 border-t">
                    <DialogClose asChild>
                        <Button
                            variant="outline"
                            type="button"
                            className="w-full sm:w-auto"
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        form={formId}
                        variant="destructive" // Makes the button red!
                        className="w-full sm:w-auto"
                        disabled={isLoading || (requireJustification && description.trim() === "")}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Deleting...
                            </>
                        ) : (
                            "Delete"
                        )}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default DeleteConfirmModal;