"use client";

import {
  List,
  Grid3x3,
  Kanban,
  Search,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import LayoutSetting from "../ui/LayoutSetting";

const STATUS_OPTIONS = [
  { value: "", label: "Status" },
  { value: "active", label: "Active" },
  { value: "completed", label: "Completed" },
  { value: "archived", label: "Archived" },
];

const TASK_STATUS_OPTIONS = [
  { value: "", label: "Status" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "review", label: "Review" },
  { value: "testing", label: "Testing" },
  { value: "done", label: "Done" },
];

const SPRINT_OPTIONS = [
  { value: "", label: "Sprints" },
  { value: "backlogs", label: "Backlogs" },
  { value: "sprints", label: "Sprints" },
];

const PROJECT_OPTIONS = [
  { value: 1, label: "Website Redesign" },
  { value: 2, label: "Mobile App UI" },
  { value: 3, label: "Admin Dashboard" },
];

const SORT_OPTIONS = [
  { value: "", label: "Sort" },
  { value: "newest", label: "Newest First" },
  { value: "oldest", label: "Oldest First" },
  { value: "name-asc", label: "Name (A-Z)" },
  { value: "name-desc", label: "Name (Z-A)" },
];

const DUE_DATE_OPTIONS = [
  { value: "", label: "Due Date" },
  { value: "overdue", label: "Overdue" },
  { value: "today", label: "Today" },
  { value: "tomorrow", label: "Tomorrow" },
  { value: "week", label: "This Week" },
  { value: "month", label: "This Month" },
];

const ASSIGNEE_OPTIONS = [
  { id: 0, value: "", label: "Assignee" },
  { id: 1, value: "john", label: "John Doe" },
  { id: 2, value: "jane", label: "Jane Smith" },
  { id: 3, value: "bob", label: "Bob Johnson" },
];

const PRIORITY_OPTIONS = [
  { value: "", label: "Priority" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const VIEW_OPTIONS = [
  { value: "Grid", icon: Grid3x3 },
  { value: "List", icon: List },
];

const FILTER_VIEW_OPTIONS = [
  { value: "Kanban", icon: Kanban },
  { value: "List", icon: List },
];

// NEW: Added deleted options for organizations
const ORG_DELETED_OPTIONS = [
  { value: "false", label: "Active Organizations" },
  { value: "true", label: "Deleted Organizations" },
];

export default function ProjectFilters({
  page,
  filters,
  setFilters,
  onClearFilter,
}) {
  const updateFilters = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // Helper to keep JSX clean
  const getSearchPlaceholder = () => {
    if (page === "organizations") return "Search organizations...";
    if (page === "projects") return "Search projects...";
    return "Search tasks...";
  };

  return (
    <div className="w-full rounded-xl border border-border/60 bg-white shadow-sm px-3 py-3 my-3">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        {/* Left Section */}
        <div className="flex flex-1 flex-wrap items-center gap-2 min-w-0">
          {/* Search - Shared across all pages */}
          <div className="relative w-full sm:w-55 md:w-62.5 shrink-0">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder={getSearchPlaceholder()}
              value={filters.search || ""}
              onChange={(e) => updateFilters("search", e.target.value)}
              className="h-8 w-full rounded-lg border border-border bg-muted/30 pl-9 pr-2 text-sm outline-none transition-all focus:border-primary focus:bg-background"
            />
          </div>

          {/* Organizations Page */}
          {page === "organizations" && (
            <>
              <StyledDropDown
                options={ORG_DELETED_OPTIONS}
                type="isDeleted"
                change={updateFilters}
                value={filters.isDeleted}
              />
              <StyledDropDown
                options={SORT_OPTIONS}
                type="sortBy"
                change={updateFilters}
                value={filters.sortBy}
              />
            </>
          )}

          {/* Projects Page */}
          {page === "projects" && (
            <>
              <StyledDropDown
                options={STATUS_OPTIONS}
                type="status"
                change={updateFilters}
                value={filters.status}
              />
              <StyledDropDown
                options={SORT_OPTIONS}
                type="sort"
                change={updateFilters}
                value={filters.sort}
              />
            </>
          )}

          {/* Project Details */}
          {page === "projectDetails" && (
            <>
              <StyledDropDown
                options={TASK_STATUS_OPTIONS}
                type="status"
                change={updateFilters}
                value={filters.status}
              />
              <StyledDropDown
                options={ASSIGNEE_OPTIONS}
                type="assignee"
                change={updateFilters}
                value={filters.assignee}
              />
              <StyledDropDown
                options={PRIORITY_OPTIONS}
                type="priority"
                change={updateFilters}
                value={filters.priority}
              />
              <StyledDropDown
                options={SORT_OPTIONS}
                type="sort"
                change={updateFilters}
                value={filters.sort}
              />
            </>
          )}

          {/* My Tasks */}
          {page === "myTasks" && (
            <>
              <StyleSearchDropdown
                options={PROJECT_OPTIONS}
                type="projectId"
                change={updateFilters}
                value={filters.projectId}
              />
              <StyledDropDown
                options={TASK_STATUS_OPTIONS}
                type="status"
                change={updateFilters}
                value={filters.status}
              />
              <StyledDropDown
                options={SPRINT_OPTIONS}
                type="sprint"
                change={updateFilters}
                value={filters.sprint}
              />
              <StyledDropDown
                options={DUE_DATE_OPTIONS}
                type="dueDate"
                change={updateFilters}
                value={filters.dueDate}
              />
              <StyledDropDown
                options={PRIORITY_OPTIONS}
                type="priority"
                change={updateFilters}
                value={filters.priority}
              />
              <StyledDropDown
                options={SORT_OPTIONS}
                type="sort"
                change={updateFilters}
                value={filters.sort}
              />
            </>
          )}
        </div>

        {/* Right Section */}
        <div className="flex w-full sm:w-auto items-center justify-between sm:justify-end gap-2 shrink-0">
          <LayoutSetting
            viewOptions={
              page === "myTasks" ||
              page === "projects" ||
              page === "organizations"
                ? VIEW_OPTIONS
                : page === "projects"
                  ? FILTER_VIEW_OPTIONS
                  : null
            }
            updateFilters={updateFilters}
            filters={filters}
          />

          <Button
            type="button"
            variant="outline"
            onClick={onClearFilter}
            className="h-8 rounded-md px-3 text-xs font-medium shrink-0"
          >
            <X className="mr-1 h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}

export function StyledDropDown({ options, type, change, value }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => change(type, e.target.value)}
      className="h-8 min-w-22 rounded-md border border-border bg-white px-1.5 text-xs outline-none transition-all focus:border-primary shrink-0"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}

export function StyleSearchDropdown({ options, type, change, value }) {
  const selectedOption = options.find(
    (option) => String(option.value) === String(value),
  );

  const selectedLabel = selectedOption?.label || "";

  return (
    <div className="w-auto min-w-27.5 shrink-0">
      <input
        list={`${type}-options`}
        id={type}
        name={type}
        value={selectedLabel}
        placeholder={options?.[0]?.label || "Select"}
        onChange={(e) => {
          const inputValue = e.target.value;

          const matchedOption = options.find(
            (option) =>
              option.label.toLowerCase().trim() ===
              inputValue.toLowerCase().trim(),
          );

          change(type, matchedOption ? matchedOption.value : "");
        }}
        className="h-8 w-full rounded-md border border-border bg-white px-2 text-xs outline-none transition-all focus:border-primary"
      />

      <datalist id={`${type}-options`}>
        {options.map((option) => (
          <option key={option.value} value={option.label} />
        ))}
      </datalist>
    </div>
  );
}
