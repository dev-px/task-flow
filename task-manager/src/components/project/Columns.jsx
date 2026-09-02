import React, { useState } from "react";
import { GripVertical, ArrowUp, ArrowDown, Loader2 } from "lucide-react";
// Adjust these imports based on your UI library (e.g., shadcn/ui)
import { Button } from "@/components/ui/button";

export default function ColumnSettings() {
  // Mock initial data - this would come from your API
  const [columns, setColumns] = useState([
    { _id: "col_1", title: "To Do" },
    { _id: "col_2", title: "In Progress" },
    { _id: "col_3", title: "In Review" },
    { _id: "col_4", title: "Done" },
  ]);

  const [isSaving, setIsSaving] = useState(false);

  // 1. Function to handle moving a column up or down in the array
  const moveColumn = (index, direction) => {
    const newColumns = [...columns];
    if (direction === "up" && index > 0) {
      // Swap with the item above
      [newColumns[index - 1], newColumns[index]] = [
        newColumns[index],
        newColumns[index - 1],
      ];
    } else if (direction === "down" && index < newColumns.length - 1) {
      // Swap with the item below
      [newColumns[index + 1], newColumns[index]] = [
        newColumns[index],
        newColumns[index + 1],
      ];
    }
    setColumns(newColumns);
  };

  // 2. Function to handle saving the final order
  const handleSave = async () => {
    setIsSaving(true);

    // Create the payload: just the array of IDs in their new order
    const payload = columns.map((col) => col._id);

    try {
      // await axios.put('/api/projects/.../columns/reorder', { columnIds: payload });
      console.log("Saving new order to database:", payload);

      // Show success toast here
    } catch (error) {
      // Show error toast here
      console.error("Failed to save order");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="space-y-2">
        {columns.map((column, index) => (
          <div
            key={column._id}
            className="flex items-center justify-between p-3 bg-background border rounded-md shadow-sm"
          >
            <div className="flex items-center gap-3">
              {/* Drag Handle Icon (Visual indicator for future drag-and-drop integration) */}
              <GripVertical className="w-5 h-5 text-muted-foreground cursor-grab" />
              <span className="font-medium">{column.title}</span>
            </div>

            {/* Accessible Reorder Buttons */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveColumn(index, "up")}
                disabled={index === 0}
                aria-label="Move column up"
              >
                <ArrowUp className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => moveColumn(index, "down")}
                disabled={index === columns.length - 1}
                aria-label="Move column down"
              >
                <ArrowDown className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end border-t pt-4">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          Save Column Order
        </Button>
      </div>
    </>
  );
}
