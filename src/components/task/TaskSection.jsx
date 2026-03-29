import TaskCard from '@/components/task/TaskCard';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { PlusCircleIcon } from 'lucide-react';

export default function TaskSection({ col }) {
    const { setNodeRef, over } = useDroppable({
        id: col.id,
        data: {
            columnId: col.id
        }
    });

    return (
        <div className={`min-w-70 max-w-70 bg-gray-50 border-2 ${col.id === over?.data?.current?.columnId ? 'border-black' : 'border-gray-100'} rounded-lg flex flex-col `}>

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
                <div className="bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:shadow-md transition cursor-pointer touch-none select-none flex flex-col gap-2 justify-center items-center h-24">
                    <PlusCircleIcon className="w-6 h-6 text-gray-400" />
                    <div className="text-base text-gray-500">Add New Task</div>
                </div>
            </div>

        </div>
    )
}