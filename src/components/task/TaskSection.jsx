"use client";

import TaskCard from "@/components/task/TaskCard";
import { useDroppable } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Pencil, Plus, PlusCircleIcon, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import DeleteDialog from "../layout/DeleteDialog";
import { deleteColumn } from "@/redux/slices/boardSlice";

export default function TaskSection({
  col,
  setShowAddTaskModal,
  setOpenTaskDialog,
  setClickedTaskId,
  handleColumnUpdates,
  setEditingColumnId,
}) {
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [targetColumn, setTargetColumn] = useState("");
  const { columns, columnTaskIds, tasks } = useSelector((state) => state.board);
  const dispatch = useDispatch();

  const taskIds = columnTaskIds[col] || [];

  const colData = Object.keys(columns).length;

  // for droppable
  const { setNodeRef, over } = useDroppable({
    id: col,
    data: {
      columnId: col,
    },
  });

  const handleEditColumn = () => {
    setEditingColumnId(col);
    handleColumnUpdates("Edit");
  };

  // delete column in kanban
  const handleDeleteColumn = () => {
    try {
      // extract deleted column task
      const reduxPayload = {
        columnId: col,
        targetColumnId: targetColumn,
      };
      dispatch(deleteColumn(reduxPayload));
    } catch (error) {
      console.error("Error while deleting column", error);
    } finally {
      setDeleteDialog(false);
      setTargetColumn("");
    }
  };

  return (
    <div
      className={`min-w-70 max-w-70 bg-gray-50 border-2 ${col === over?.data?.current?.columnId ? "border-black" : "border-gray-100"} rounded-lg flex flex-col `}
    >
      {/* Column Header */}
      <div className="p-4 border-b flex justify-between items-center">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-sm font-semibold truncate">{col}</h2>
          <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
            {taskIds.length}
          </span>
        </div>

        <div className="flex gap-1">
          {/* Add Task */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 cursor-pointer rounded-full p-2 hover:bg-gray-200"
                onClick={() => setShowAddTaskModal(true)}
              >
                <Plus size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Add Task</TooltipContent>
          </Tooltip>

          {/* Edit Column */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="h-6 w-6 cursor-pointer rounded-full p-2 hover:bg-gray-200"
                onClick={() => handleEditColumn()}
              >
                <Pencil size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Edit Column</TooltipContent>
          </Tooltip>

          {/* Delete Column */}
          <Tooltip>
            <TooltipTrigger
              asChild
              className={colData <= 1 && "cursor-not-allowed p-0 m-0"}
            >
              <span className="p-0 m-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-6 w-6 cursor-pointer rounded-full p-2 hover:bg-gray-200"
                  disabled={colData <= 1}
                  onClick={() => setDeleteDialog(true)}
                >
                  <Trash2 size={14} />
                </Button>
              </span>
            </TooltipTrigger>

            <TooltipContent>
              {colData <= 1
                ? "At least one column is required"
                : "Delete column"}
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Cards Container */}
      <div
        ref={setNodeRef}
        className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-3 min-h-25"
      >
        {/* Example Cards */}
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {taskIds.map((taskId, index) => (
            <TaskCard
              key={taskId}
              task={tasks[taskId]}
              index={index}
              setOpenTaskDialog={setOpenTaskDialog}
              setClickedTaskId={setClickedTaskId}
            />
          ))}
        </SortableContext>
        <div
          className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer touch-none select-none flex flex-col gap-2 justify-center items-center h-24"
          onClick={() => setShowAddTaskModal(true)}
        >
          <PlusCircleIcon className="w-6 h-6 text-gray-400" />
          <div className="text-base text-gray-500">Add New Task</div>
        </div>
      </div>

      {/* Delete Dialog */}
      <DeleteDialog
        open={deleteDialog}
        setOpen={setDeleteDialog}
        type="column"
        deletingColumnId={col}
        targetColumn={targetColumn}
        setTargetColumn={setTargetColumn}
        handleDelete={handleDeleteColumn}
      />
    </div>
  );
}
