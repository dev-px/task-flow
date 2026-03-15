"use client";

import { useState } from "react";
import { List, Grid3x3, Tally1 } from 'lucide-react';

export default function ProjectFilters() {
    const [searchInput, setSearchInput] = useState("");
    const [projectStatus, setProjectStatus] = useState("");
    const [projectSortOption, setProjectSortOption] = useState("");
    const [toggleView, setToggleView] = useState("List")

    const statusOptions = [
        { value: "", label: "All Status" },
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

    const onClearFilter = () => {
        setSearchInput("");
        setProjectStatus("");
        setProjectSortOption("");
        setToggleView("List");
    }

    return (
        <div className="my-8 flex flex-wrap gap-8 items-center">

            {/* input */}
            <input
                type="text"
                placeholder="Search project, description..."
                className="border-b py-1 outline-0 focus:outline-none transition w-full md:w-auto"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
            />

            {/* status - dropdown */}
            <select className="border-b py-1.5 outline-0 focus:outline-none transition w-full md:w-auto"
                value={projectStatus} onChange={(e) => setProjectStatus(e.target.value)}>
                {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* sort - dropdown */}
            <select className="border-b py-1.5 outline-0 focus:outline-none transition w-full md:w-auto"
                value={projectSortOption} onChange={(e) => setProjectSortOption(e.target.value)}>
                {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>

            {/* list/grid view */}
            <div className="flex justify-center gap-2 p-0.75 items-center border rounded-sm transition">
                <button className="cursor-pointer" onClick={() => setToggleView("List")} >
                    <List size={25} className={`${toggleView === "List" ? "bg-gray-100" : ""} p-1 rounded-sm`} />
                </button>
                <button className="cursor-pointer" onClick={() => setToggleView("Grid")} >
                    <Grid3x3 size={25} className={`${toggleView === "Grid" ? "bg-gray-100" : ""} p-1 rounded-sm`} />
                </button>
            </div>


            {/* reset button */}
            <button type="reset" className="border px-4 rounded-sm py-0.75 outline-0 focus:outline-none transition cursor-pointer" onClick={onClearFilter}>
                Reset
            </button>
        </div>
    )
}