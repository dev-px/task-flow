"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { dummyData } from "@/utils/helper";
import TaskSection from "@/components/task/TaskSection";
import { useDispatch, useSelector } from "react-redux";
import { moveTask, setBoard } from "@/redux/slices/boardSlice";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import TaskCard from "@/components/task/TaskCard";
import ProjectHeader from "@/components/project/ProjectHeader";
import ProjectFilters from "@/components/project/ProjectFilters";
import { PlusCircleIcon } from "lucide-react";
import AddEditProject from "@/components/project/ProjectPageDialogs/AddEditProject";
import NewColumnDialog from "@/components/project/ProjectPageDialogs/NewColumnDialog";
import NewTaskDialog from "@/components/task/TaskDialogs/NewTaskDialog";
import ManageMembersModal from "@/components/project/ProjectPageDialogs/ManageMember";
import TaskDetailsDialog from "@/components/task/TaskDialogs/TaskDetailsDailog";
import { initialProjectState } from "@/utils/constant";

export default function KanBanPage() {
  const { projectId } = useParams();
  const [showModal, setShowModal] = useState(false);
  const [showColumnModal, setShowColumnModal] = useState(false);
  const [showTaskModal, setShowAddTaskModal] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [activeColumnId, setActiveColumnId] = useState(null); // for adding tasks
  const [editingColumnId, setEditingColumnId] = useState(null); // for column modal
  const [activeTask, setActiveTask] = useState(null);
  const dispatch = useDispatch();
  const { columns, columnOrder, columnTaskIds, tasks } = useSelector(
    (state) => state.board,
  );
  const [openTaskDialog, setOpenTaskDialog] = useState(false);
  const [clickedTaskId, setClickedTaskId] = useState(null);
  const [manageColumnType, setManageColumnType] = useState("");
  // edit project modal
  const [form, setForm] = useState(initialProjectState);
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    priority: "",
    sort: "",
    assignee: "",
    group: "",
    view: "Kanban",
  });

  const onClearFilter = () => {
    setFilters({
      search: "",
      status: "",
      priority: "",
      sort: "",
      assignee: "",
      group: "",
      view: "Kanban",
    });
  };

  // dummy API
  const data = dummyData.find((project) => project.id === parseInt(projectId));

  useEffect(() => {
    // function generateColumns(cols, allTasks) {
    //   const columnData = {};
    //   const finalData = {};

    //   cols.forEach((col) => {
    //     columnData[col?.id] = {
    //       ...col,
    //       tasks: [],
    //     };
    //   });

    //   allTasks.forEach((t) => {
    //     if (columnData[t.columnId]) {
    //       columnData[t.columnId].tasks.push(t);
    //     }
    //   });

    //   // sort tasks in each column based on columnOrder --> which is responsible for vertical ordering inside board column
    //   Object.values(columnData).forEach((col) => {
    //     col.tasks.sort((a, b) => a.columnOrder - b.columnOrder);
    //   });

    //   // sort columns based on column order --> which is responsible for horizontal ordering in board
    //   const sortedColumns = Object.values(columnData).sort(
    //     (a, b) => a.order - b.order,
    //   );

    //   sortedColumns.forEach((col) => (finalData[col?.id] = { ...col }));
    //   return finalData;
    // }

    if (data) {
      // const columns = generateColumns(data?.columns, data?.tasks);
      // console.log(columns);
      dispatch(setBoard(data));
    }
  }, [data]);

  // on Edit Peoject Modal
  const handleEditProject = () => {
    setForm({
      name: data?.title || "",
      description: data?.description || "",
      status: data?.status || "status",
      priority: data?.priority || "priority",
      startDate: data?.startDate || "",
      dueDate: data?.dueDate || "",
      visibility: data?.visibility || "visibility",
    });
    setShowModal(true);
  };

  // for small screens --> drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // small movement before drag starts
      },
    }),
  );

  // Show Dialog for Add and Edit Column in kanban
  const handleColumnUpdates = (type) => {
    if (!type) return;

    if (type === "Add") {
      setEditingColumnId(null);
    }

    setManageColumnType(type);
    setShowColumnModal(true);
  };

  // it helps to show task's drag overlay UI that enhance UX
  const handleDragStart = (event) => {
    const { active } = event;
    setActiveTask(active.id);
  };

  const handleDragEnd = (event) => {
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const taskId = active.id;

    const sourceCol = active.data.current?.columnId;

    const destCol =
      over.data.current?.columnId ?? (columnTaskIds[over.id] ? over.id : null);

    if (!sourceCol || !destCol) return;

    const sourceTasks = columnTaskIds[sourceCol] || [];
    const destTasks = columnTaskIds[destCol] || [];

    const oldIndex = sourceTasks.indexOf(taskId);

    let newIndex;

    if (columnTaskIds[over.id]) {
      // dropped on empty column
      newIndex = destTasks.length;
    } else {
      newIndex = destTasks.indexOf(over.id);
    }

    if (oldIndex === -1) return;

    dispatch(
      moveTask({
        taskId,
        sourceCol,
        destCol,
        overIndex: newIndex === -1 ? destTasks.length : newIndex,
      }),
    );
  };

  const findTaskById = (id) => tasks[id];

  useEffect(() => {
    console.log("columns:", columns);
    console.log("columnOrder:", columnOrder);
    console.log("columnTaskIds:", columnTaskIds);
    console.log("tasks:", tasks);
  }, [columns, columnOrder, columnTaskIds, tasks]);

  return (
    <div className="p-3">
      {/* Project Details title + Edit Project */}
      <ProjectHeader
        pTitle={data?.title}
        pDescription={data?.description}
        type="edit"
        setShowManageMembersModal={setShowManageMembersModal}
        projectId={projectId}
        handleProjectManipulation={handleEditProject}
      />

      {/* task filter section */}
      <ProjectFilters
        page="projectDetails"
        filters={filters}
        setFilters={setFilters}
        onClearFilter={onClearFilter}
      />

      {/* KanBan Section */}
      <section>
        {Object.keys(tasks).length > 0 ? (
          <>
            <DndContext
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              collisionDetection={closestCenter}
              sensors={sensors}
            >
              <div className="flex gap-6 overflow-x-auto h-[calc(100vh-90px)]">
                {columnOrder.map((col) => (
                  <div onClick={() => setActiveColumnId(col)} key={col}>
                    <TaskSection
                      col={col}
                      setShowAddTaskModal={setShowAddTaskModal}
                      setOpenTaskDialog={setOpenTaskDialog}
                      setClickedTaskId={setClickedTaskId}
                      handleColumnUpdates={handleColumnUpdates}
                      setEditingColumnId={setEditingColumnId}
                    />
                  </div>
                ))}
                {/* {Object.values(columnData).map((col) => (
                  <div onClick={() => setActiveColumnId(col?.id)} key={col.id}>
                    <TaskSection
                      col={col}
                      setShowAddTaskModal={setShowAddTaskModal}
                      setOpenTaskDialog={setOpenTaskDialog}
                      setClickedTaskId={setClickedTaskId}
                      handleColumnUpdates={handleColumnUpdates}
                      setEditingColumnId={setEditingColumnId}
                    />
                  </div>
                ))} */}

                {/* Add new Column button */}
                <div
                  className="min-w-70 max-w-70 bg-gray-50 border-2 border-gray-100 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100"
                  onClick={() => handleColumnUpdates("Add")}
                >
                  <PlusCircleIcon className="w-10 h-10 text-gray-400" />
                  <span className="text-sm text-gray-500 mt-2">
                    Add New Column
                  </span>
                </div>
              </div>
              <DragOverlay>
                {activeTask ? (
                  <TaskCard task={findTaskById(activeTask)} index={0} />
                ) : null}
              </DragOverlay>
            </DndContext>
          </>
        ) : (
          <div className="flex justify-center items-center h-full font-semibold">
            No Task Available
          </div>
        )}
      </section>

      {/* Edit Project Dialog */}
      <AddEditProject
        showModal={showModal}
        setShowModal={setShowModal}
        type="edit"
        projectId={projectId}
        form={form}
        setForm={setForm}
      />

      {/* Manage Members Dialog */}
      <ManageMembersModal
        open={showManageMembersModal}
        setOpen={setShowManageMembersModal}
      />

      {/* New Column Dialog */}
      <NewColumnDialog
        open={showColumnModal}
        setOpen={setShowColumnModal}
        columnId={editingColumnId}
        type={manageColumnType}
      />

      {/* New Task Dialog */}
      <NewTaskDialog
        open={showTaskModal}
        setOpen={setShowAddTaskModal}
        columnId={activeColumnId}
      />

      {/* dialog for task details */}
      <TaskDetailsDialog
        openTaskDialog={openTaskDialog}
        setOpenTaskDialog={setOpenTaskDialog}
        task={findTaskById(clickedTaskId)}
        projectId={projectId}
      />
    </div>
  );
}
