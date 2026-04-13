import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function AddSubtaskDialog({
  open,
  setOpen,
  handleAdd,
  subtask,
  setSubtask,
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)}>
        <Plus size={16} className="mr-2" /> Add Subtask
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Subtask</DialogTitle>
          <DialogDescription>
            Break this task down into smaller, manageable steps.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Subtask Title *</Label>
            <Input
              placeholder="E.g., Design the database schema"
              value={subtask.title}
              onChange={(e) =>
                setSubtask({ ...subtask, title: e.target.value })
              }
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              placeholder="Add more details..."
              className="resize-none min-h-25"
              value={subtask.description}
              onChange={(e) =>
                setSubtask({ ...subtask, description: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={subtask.dueDate}
                onChange={(e) =>
                  setSubtask({ ...subtask, dueDate: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Priority</Label>
              <Select
                value={subtask.priority}
                onValueChange={(v) => setSubtask({ ...subtask, priority: v })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleAdd} disabled={!subtask.title.trim()}>
            Create Subtask
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
