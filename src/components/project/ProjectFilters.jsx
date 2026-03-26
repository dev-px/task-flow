"use client";

import { List, Grid3x3 } from 'lucide-react';

export default function ProjectFilters({ filters, setFilters }) {
    const statusOptions = [
        { value: "", label: "Status" },
        { value: "active", label: "Active" },
        { value: "completed", label: "Completed" },
        { value: "archived", label: "Archived" },
    ];

    const sortOptions = [
        { value: "", label: "Sort" },
        { value: "newest", label: "Newest First" },
        { value: "oldest", label: "Oldest First" },
        { value: "name-asc", label: "Name (A-Z)" },
        { value: "name-desc", label: "Name (Z-A)" },
    ];

    // view option - list or grid
    const viewOptions = [
        { value: "Grid", icon: Grid3x3 },
        { value: "List", icon: List }
    ];

    const updateFilters = (key, value) => {
        setFilters((prev) => {
            return { ...prev, [key]: value };
        });
    };

    // reset all filters
    const onClearFilter = () => {
        setFilters({
            search: "",
            status: "",
            sort: "",
            view: "List"
        })
    };

    return (
        <div className="my-8 flex flex-wrap gap-8 items-center">

            {/* input */}
            <input
                type="text"
                placeholder="Search project, description..."
                className="border-b py-1 outline-0 focus:outline-none transition w-full md:w-auto"
                value={filters.search}
                onChange={(e) => updateFilters("search", e.target.value)}
            />

            {/* status - dropdown */}
            <select className="border-b py-1.5 outline-0 focus:outline-none transition w-full md:w-auto"
                value={filters.status} onChange={(e) => updateFilters("status", e.target.value)}>
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-100">
                        {option.label}
                    </option>
                ))}
            </select>

            {/* sort - dropdown */}
            <select className="border-b py-1.5 outline-0 focus:outline-none transition w-full md:w-auto"
                value={filters.sort} onChange={(e) => updateFilters("sort", e.target.value)}>
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value} className="bg-gray-100">
                        {option.label}
                    </option>
                ))}
            </select>

            {/* list/grid view */}
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

            {/* reset button */}
            <button type="reset" className="border px-4 rounded-sm py-0.75 outline-0 focus:outline-none transition cursor-pointer" onClick={onClearFilter}>
                Reset
            </button>
        </div>
    )
}