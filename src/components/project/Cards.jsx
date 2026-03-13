export default function Cards({ title, description, status }) {
    return (
        <div className="min-w-55 md:min-w-60 lg:min-w-70 h-40 shrink-0 snap-start border rounded-lg p-4 bg-white transition relative cursor-pointer">
            <div className="flex flex-col justify-start gap-0.5">
                <h3 className="font-semibold text-base md:text-lg truncate text-left">{title}</h3>
                {/* description for project */}
                <p className="text-sm text-gray-600 truncate mt-1">{description}</p>
                {/* deadline for task */}
                <p className="text-sm text-gray-600 truncate mt-1">Deadline: {description}</p>
            </div>
            <div className="absolute bottom-0 right-0">
                {/* status of task */}
                <p className="text-sm text-gray-600 truncate mt-1 pb-2 pr-2">{status}</p>
            </div>
        </div>
    )
}