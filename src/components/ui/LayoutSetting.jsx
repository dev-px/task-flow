export default function LayoutSetting({ viewOptions, updateFilters, filters }) {
    return (
        <div className="flex justify-center gap-2 p-0.5 items-center border rounded-sm transition">
            {viewOptions.map((option) => {
                const Icon = option.icon;

                return (
                    <button key={option.value} className={`cursor-pointer p-0.5 rounded-sm transition
        ${filters.view === option.value ? "bg-gray-100" : "hover:bg-gray-100/90"}`}
                        onClick={() => updateFilters("view", option.value)}
                    >
                        <Icon size={23} />
                    </button>
                );
            })}
        </div>
    )
}