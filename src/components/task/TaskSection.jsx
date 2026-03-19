import TaskCard from '@/components/task/TaskCard';

export default function TaskSection({ col }) {
    return (
        <div className="min-w-[280px] max-w-[280px] bg-gray-50 border border-gray-100 rounded-lg flex flex-col">

            {/* Column Header */}
            <div className="p-4 border-b flex justify-between items-center">
                <h2 className="text-sm font-semibold">{col?.id}</h2>
                <span className="text-xs text-gray-500">{col.tasks.length}</span>
            </div>

            {/* Cards Container */}
            <div className="flex-1 overflow-y-auto hide-scrollbar p-3 space-y-3">

                {/* Example Cards */}
                {col.tasks.map((item) => (
                    <TaskCard key={item?.id} task={item} />
                ))}

            </div>

        </div>
    )
}