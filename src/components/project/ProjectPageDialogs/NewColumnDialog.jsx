"use client";

import { useEffect, useState } from "react";
import { Button } from "../../ui/button";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { addColumn } from "@/redux/slices/boardSlice";

export default function NewColumnDialog({ open, setOpen, columnId, type }) {
  const dispatch = useDispatch();
  const [name, setName] = useState("");
  const [wipLimit, setWipLimit] = useState(null);
  const { columns } = useSelector((state) => state.board);

  const onCloseAddColumnDialog = () => {
    setOpen(false);
    setName("");
    setWipLimit("");
  };

  const handleColumnSubmit = (e) => {
    e.preventDefault();
    const colName = name.trim();
    if (!columns) return;
    if (columns[colName.toLowerCase()]) {
      console.error("Column already exists");
      return;
    }
    try {
      const reduxPayload = {
        id: colName.toLowerCase(),
        title: colName,
        wipLimit: wipLimit || null,
      };

      const payload = { ...reduxPayload };

      dispatch(addColumn(reduxPayload));

      console.log(payload);
    } catch (error) {
      console.error("Task creation failed", error);
    } finally {
      onCloseAddColumnDialog();
    }
  };

  useEffect(() => {
    if (columns && columnId) {
      const col = Object.values(columns).find((c) => c.id === columnId);

      if (col) {
        setName(col.title);
        setWipLimit(col.wipLimit || "");
      }
    } else {
      // Add mode → reset form
      setName("");
      setWipLimit("");
    }
  }, [columns, columnId]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleColumnSubmit}>
          <DialogHeader>
            <DialogTitle className="text-lg font-bold mb-2">
              {type} Column
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Column Name */}
            <div className="space-y-2">
              <Label>Column Name</Label>
              <Input
                placeholder="e.g. In Progress"
                value={name}
                onChange={(e) => setName(e.target.value.trim())}
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
            <Button type="submit">{type} Column</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
