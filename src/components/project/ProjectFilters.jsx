"use client";

import { List, Grid3x3, Kanban, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import DropDown from "./../ui/Dropdown";
import LayoutSetting from "../ui/LayoutSetting";

export default function ProjectFilters({
  page,
  filters,
  setFilters,
  onClearFilter,
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

  const priorityOptions = [
    { value: "", label: "Priority" },
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "critical", label: "Critical" },
  ];

  const assigneeOption = [
    { id: 0, value: "", label: "Assignee" },
    { id: 1, value: "john", label: "John Doe" },
    { id: 2, value: "jane", label: "Jane Smith" },
    { id: 3, value: "bob", label: "Bob Johnson" },
  ];

  const viewOptions = [
    { value: "Grid", icon: Grid3x3 },
    { value: "List", icon: List },
  ];

  const filterViewOption = [
    { value: "Kanban", icon: Kanban },
    { value: "List", icon: List },
  ];

  const updateFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <div className="w-full rounded-xl border bg-background px-4 py-4 md:px-5 shadow-sm my-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Left Side Filters */}
        <div className="flex flex-1 flex-wrap items-center gap-4 md:gap-5">
          {/* Search */}
          <div className="relative min-w-[220px] flex-1 md:max-w-sm">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder={
                page === "projects"
                  ? "Search project, description..."
                  : "Search task, assignee..."
              }
              value={filters.search}
              onChange={(e) => updateFilters("search", e.target.value)}
              className="w-full border-0 border-b bg-transparent pl-6 pr-2 pb-2 pt-1 text-sm outline-none focus:border-primary"
            />
          </div>

          {/* Status */}
          <DropDown
            options={statusOptions}
            type="status"
            change={updateFilters}
            value={filters.status}
          />

          {/* Priority */}
          {page === "projectDetails" && (
            <DropDown
              options={priorityOptions}
              type="priority"
              change={updateFilters}
              value={filters.priority}
            />
          )}

          {/* Sort */}
          <DropDown
            options={sortOptions}
            type="sort"
            change={updateFilters}
            value={filters.sort}
          />

          {/* Assignee */}
          {page === "projectDetails" && (
            <DropDown
              options={assigneeOption}
              type="assignee"
              change={updateFilters}
              value={filters.assignee}
            />
          )}
        </div>

        {/* Right Side Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <LayoutSetting
            viewOptions={page === "projects" ? viewOptions : filterViewOption}
            updateFilters={updateFilters}
            filters={filters}
          />

          <Button
            type="button"
            variant="ghost"
            onClick={onClearFilter}
            className="h-9 px-3 text-sm"
          >
            <X className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- DROPDOWN UI ---------------- */

export function StyledDropDown({ options, type, change, value }) {
  return (
    <select
      value={value}
      onChange={(e) => change(type, e.target.value)}
      className="min-w-[130px] border-0 border-b bg-transparent pb-2 pt-1 text-sm outline-none focus:border-primary w-full md:w-auto"
    >
      {options.map((option) => (
        <option
          key={option.value}
          value={option.value}
          className="bg-background"
        >
          {option.label}
        </option>
      ))}
    </select>
  );
}
