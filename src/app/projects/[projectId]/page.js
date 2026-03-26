"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { projectsKanban } from "@/utils/helper";
import TaskSection from "@/components/task/TaskSection";
import { useDispatch, useSelector } from "react-redux";
import { moveTask, setBoard } from "@/redux/slices/boardSlice";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragOverlay } from "@dnd-kit/core";
import TaskCard from "@/components/task/TaskCard";

export default function KanBanPage() {
    const { projectId } = useParams();
    const dispatch = useDispatch();
    const [activeTask, setActiveTask] = useState(null);
    const columnData = useSelector((state) => state.board.columns);

    const data = projectsKanban.find((project) => project.id === parseInt(projectId));

    useEffect(() => {
        if (data?.columns && Object.keys(columnData).length === 0) {
            dispatch(setBoard(data.columns));
        }
    }, [data, columnData]);

    // for small screens
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5, // small movement before drag starts
            },
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        setActiveTask(active.id);
    };

    const handleDragEnd = (event) => {
        setActiveTask(null);
        // active --> it's for the task which we move
        // over --> from where we placed the moved task
        const { active, over } = event;
        if (!over) return;

        const taskId = active.id;

        // finding source column id
        const sourceCol = active.data.current?.columnId;

        // finding destination column id
        const destCol = over.data.current?.columnId ?? (columnData[over.id] ? over.id : null);

        const sourceTasks = columnData[sourceCol]?.tasks || [];
        const destTasks = columnData[destCol]?.tasks || [];

        const oldIndex = sourceTasks.findIndex(t => t.id === taskId);
        const newIndex = destTasks.findIndex(t => t.id === over.id);
        console.log(oldIndex, newIndex);
        if (oldIndex === -1) return;

        dispatch(
            moveTask({
                taskId,
                sourceCol,
                destCol,
                overIndex: newIndex === -1 ? destTasks.length : newIndex
            })
        );
    };

    const findTaskById = (id) => {
        for (const col of Object.values(columnData)) {
            const task = col.tasks.find(t => t.id === id);
            if (task) return task;
        }
        return null;
    };

    useEffect(() => {
        console.log("UPDATED columnData:", columnData);
    }, [columnData]);

    console.log("RENDERS", columnData);

    return (
        <div>
            {columnData && Object.keys(columnData).length > 0 ? (
                <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd} collisionDetection={closestCenter} sensors={sensors}>
                    <div className="flex gap-6 overflow-x-auto p-2 h-[calc(100vh-100px)]">
                        {Object.values(columnData).map((col) => (
                            <TaskSection key={col.id} col={col} />
                        ))}
                    </div>
                    <DragOverlay>
                        {activeTask ? (
                            <TaskCard
                                task={findTaskById(activeTask)}
                                index={0}
                            />
                        ) : null}
                    </DragOverlay>
                </DndContext>
            ) : (
                <div className="flex justify-center items-center h-full font-semibold">
                    No Task Available
                </div>
            )}
        </div>
    );
}