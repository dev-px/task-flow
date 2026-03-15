export default function Cards({ title, description, status }) {
    return (
        <div className="w-55 md:w-62.5 lg:w-70 h-40 shrink-0 snap-start border rounded-lg p-4 bg-white relative cursor-pointer transition">

            <div className="flex flex-col gap-1">
                <h3 className="font-semibold text-base md:text-lg truncate">{title}</h3>
                {/* description */}
                <p className="text-sm text-gray-600 line-clamp-2 truncate">{description}</p>
                {/* deadline */}
                <p className="text-sm text-gray-600 truncate">Deadline: {description}</p>
            </div>

            <div className="absolute bottom-2 right-3">
                <p className="text-xs text-gray-500">{status}</p>
            </div>

        </div>
    )
}