"use client";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

import { Trash2, AlertTriangle } from "lucide-react";
import { useSelector } from "react-redux";

export default function DeleteDialog({
  open,
  setOpen,
  type,
  deletingColumnId,
  targetColumn,
  setTargetColumn,
  handleDelete,
}) {
  const { columns, columnTaskIds } = useSelector((state) => state.board);

  const taskCount = columnTaskIds[deletingColumnId]?.length || 0;

  const availableColumns = Object.values(columns || {}).filter((col) => {
    if (!col) return false;

    const isNotDeleting = col.id !== deletingColumnId;
    const currentTasks = columnTaskIds[col.id]?.length || 0;

    const withinLimit =
      col.wipLimit === null || currentTasks + taskCount <= col.wipLimit;

    return isNotDeleting && withinLimit;
  });

  const isDeleteDisabled =
    type === "column" &&
    taskCount > 0 &&
    (availableColumns.length === 0 || !targetColumn);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md space-y-5">
        {/* HEADER */}
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 size={18} />
            Delete {type}
          </DialogTitle>

          <DialogDescription>
            This action is permanent and cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* WARNING BLOCK */}
        <div className="flex gap-3 p-3 rounded-md border bg-red-50 border-red-200">
          <AlertTriangle className="text-red-500 mt-0.5" size={16} />

          <div className="text-sm space-y-1">
            <p className="font-medium text-red-600">
              You're about to delete this {type}.
            </p>

            {taskCount > 0 ? (
              <p className="text-muted-foreground">
                This column contains{" "}
                <span className="font-medium">{taskCount}</span> task
                {taskCount > 1 ? "s" : ""}. You must move them before deletion.
              </p>
            ) : (
              <p className="text-muted-foreground">
                This {type} will be removed immediately.
              </p>
            )}
          </div>
        </div>

        {/* MOVE TASKS */}
        {taskCount > 0 && (
          <div className="space-y-2">
            {availableColumns.length > 0 ? (
              <>
                <Label>Move tasks to</Label>

                <Select value={targetColumn} onValueChange={setTargetColumn}>
                  <SelectTrigger className={`w-full`}>
                    <SelectValue placeholder="Select a destination column" />
                  </SelectTrigger>

                  <SelectContent>
                    {availableColumns.map((col) => (
                      <SelectItem key={col.id} value={col.id}>
                        {col.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <p className="text-xs text-muted-foreground">
                  Tasks will be moved before deleting this column.
                </p>
              </>
            ) : (
              <div className="text-sm border rounded-md p-3 space-y-2">
                <p className="font-medium">No available columns</p>

                <p className="text-muted-foreground text-xs">
                  All columns have reached their WIP limits.
                </p>

                <p className="text-muted-foreground text-xs">
                  To continue, you can:
                </p>

                <ul className="text-xs text-muted-foreground list-disc pl-4 space-y-1">
                  <li>Move fewer tasks</li>
                  <li>Increase a column's WIP limit</li>
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ACTIONS */}
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline" className="cursor-pointer">
              Cancel
            </Button>
          </DialogClose>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleteDisabled}
            className="flex items-center gap-1 cursor-pointer"
          >
            <Trash2 size={14} />
            Delete {type}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
