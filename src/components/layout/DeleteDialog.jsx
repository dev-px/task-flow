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
  type = "column",
  deletingColumnId,
  targetColumn,
  setTargetColumn,
  handleDelete,
}) {
  const columnData = useSelector((state) => state.board.columns);
  const taskCount = Object.values(columnData).find(
    (c) => c?.id == deletingColumnId,
  )?.tasks?.length;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md space-y-4">
        {/* HEADER */}
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <Trash2 size={18} />
            Delete {type}
          </DialogTitle>

          <DialogDescription className="text-sm text-muted-foreground">
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        {/* WARNING */}
        <div className="flex items-start gap-3 p-3 rounded-md bg-red-50 border border-red-200">
          <AlertTriangle className="text-red-500 mt-0.5" size={16} />
          <div className="text-sm">
            <p className="font-medium text-red-600">
              You are about to delete this {type}.
            </p>
            {taskCount > 0 && (
              <p className="text-muted-foreground">
                {taskCount} tasks will be moved to another column.
              </p>
            )}
          </div>
        </div>

        {/* MOVE TASKS */}
        {taskCount > 0 && (
          <div className="space-y-2">
            <Label>Move tasks to</Label>

            <Select value={targetColumn} onValueChange={setTargetColumn}>
              <SelectTrigger>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>

              <SelectContent>
                {Object.keys(columnData || {})
                  .filter((id) => id !== deletingColumnId)
                  .map((id) => (
                    <SelectItem key={id} value={id}>
                      {columnData[id].title || id}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* ACTIONS */}
        <DialogFooter className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-1"
          >
            <Trash2 size={14} />
            Delete {type}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
