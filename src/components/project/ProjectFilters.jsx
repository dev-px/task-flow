"use client";

import { List, Grid3x3, Kanban } from "lucide-react";
import DropDown from "./../ui/Dropdown";
import LayoutSetting from "../ui/LayoutSetting";
import { Button } from '@/components/ui/button';

export default function ProjectFilters({
  page,
  filters,
  setFilters,
  onClearFilter
}) {
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
    { value: "List", icon: List },
  ];

  // view option --> for filter
  const filterViewOption = [
    { value: "Kanban", icon: Kanban },
    { value: "List", icon: List },
  ];

  // priority for project detail
  const priorityOptions = [
    { value: "", label: "Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  const updateFilters = (key, value) => {
    setFilters((prev) => {
      return { ...prev, [key]: value };
    });
  };

  const assigneeOption = [
    { id: 0, value: "", label: "Assignee" },
    { id: 1, value: "john", label: "John Doe" },
    { id: 2, value: "jane", label: "Jane Smith" },
    { id: 3, value: "bob", label: "Bob Johnson" },
  ];

  return (
    <div className="my-8 flex flex-wrap gap-8 items-center">
      {/* input */}
      <input
        type="text"
        placeholder={
          page === "projects"
            ? "Search project, description..."
            : "Search task, assignee..."
        }
        className="border-b py-1 outline-0 focus:outline-none transition w-full md:w-auto"
        value={filters.search}
        onChange={(e) => updateFilters("search", e.target.value)}
      />

      {/* status - dropdown */}
      <DropDown
        options={statusOptions}
        type="status"
        change={updateFilters}
        value={filters.status}
      />

      {/* priority - dropdown */}
      {page === "projectDetails" && (
        <DropDown
          options={priorityOptions}
          type="priority"
          change={updateFilters}
          value={filters.priority}
        />
      )}

      {/* sort - dropdown */}
      <DropDown
        options={sortOptions}
        type="sort"
        change={updateFilters}
        value={filters.sort}
      />

      {/* assignee - dropdown */}
      {page === "projectDetails" && (
        <DropDown
          options={assigneeOption}
          type="assignee"
          change={updateFilters}
          value={filters.assignee}
        />
      )}

      {/* list/grid view */}
      <LayoutSetting
        viewOptions={page === "projects" ? viewOptions : filterViewOption}
        updateFilters={updateFilters}
        filters={filters}
      />

      {/* reset button */}
      <Button
        type="reset"
        size="lg"
        variant="outline"
        onClick={() => onClearFilter()}
      >
        Reset
      </Button>
    </div>
  );
}
