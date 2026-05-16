export const initialProjectState = {
  name: "",
  description: "",
  status: "",
  priority: "",
  visibility: "",
  startDate: "",
  dueDate: "",
};

export const initialProjectSettingForm = {
  name: "",
  description: "",
  logo: "",
  status: "",
  priority: "",
  visibility: "",
  startDate: "",
  dueDate: "",
  members: [],
  links: [],
  documents: [],
};

export const initialNewtaskForm = {
  title: "",
  description: "",
  priority: "medium",
  assigneeId: "",
  dueDate: "",
  sprintId: "",
  type: "task",
  subTasks: [],
};
export const initialSprint = {
  name: "",
  goal: "",
  startDate: "",
  endDate: "",
  status: "planned",
  capacity: "",
  velocityTarget: "",
  epicId: "",
};

export const initialTaskDeatilsForm = {
  title: "",
  description: "",
  type: "task",
  status: "todo",
  priority: "medium",
  assignee: "",
  reporterId: "",
  epicId: "",
  sprintId: null,
  columnId: "todo",
  columnOrder: 0,
  labels: [],
  dueDate: "",
  storyPoints: 0,
  comments: [],
  subtasks: [],
  attachments: [],
  activity: [],
  createdAt: "",
  updatedAt: "",
};

// filters
export const initialProjectFilters = {
  search: "",
  status: "",
  sort: "",
  view: "Grid",
};
export const initialProjectDetailsFilters = {
  search: "",
  status: "",
  priority: "",
  sort: "",
  assignee: "",
  group: "",
  view: "Kanban",
};

// filter for all task page
export const initialMyTasksFilter = {
  search: "",
  projectId: "",
  status: "",
  priority: "",
  view: "Grid",
  sprint: "",
  dueDate: "",
  sort: "",
};
