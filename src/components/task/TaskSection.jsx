import TaskCard from '@/components/task/TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export default function TaskSection({ col }) {
    const { setNodeRef } = useDroppable({
        id: col.id,
        data: {
            columnId: col.id
        }
    });
    return (
        <div className={`min-w-70 max-w-70 bg-gray-50 border border-gray-100 rounded-lg flex flex-col `}>

            {/* Column Header */}
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-sm font-semibold">{col?.id}</h2>
                <span className="text-xs text-gray-500">{col.tasks.length}</span>
            </div>

            {/* Cards Container */}
            <div ref={setNodeRef} className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-3 min-h-25">

                {/* Example Cards */}
                <SortableContext
                    items={col.tasks.map(t => t.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {col.tasks.map((item, index) => (
                        <TaskCard key={item?.id} task={item} index={index} />
                    ))}
                </SortableContext>

            </div>

        </div>
    )
}