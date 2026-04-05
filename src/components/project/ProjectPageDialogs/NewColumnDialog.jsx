"use client";

import { useState } from "react";
import { Button } from "../../ui/button";
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';

export default function NewColumnDialog({
  open,
  setOpen,
  existingColumns = [],
}) {
  const [name, setName] = useState("");
  const [wipLimit, setWipLimit] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const newColumn = {
      name,
      order: existingColumns.length + 1,
      wipLimit: wipLimit ? Number(wipLimit) : null,
    };

    console.log(newColumn);

    setOpen(false);
    setName("");
    setWipLimit("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold mb-2">
              Create Column
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Column Name */}
            <div className="space-y-2">
              <Label>Column Name</Label>
              <Input
                placeholder="e.g. In Progress"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* WIP Limit */}
            <div className="space-y-2">
              <Label>WIP Limit</Label>
              <Input
                type="number"
                min={1}
                placeholder="Max tasks allowed"
                value={wipLimit}
                onChange={(e) => setWipLimit(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Limit how many tasks can be in this column
              </p>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit">Create Column</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
