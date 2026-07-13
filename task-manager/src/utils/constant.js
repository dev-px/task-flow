export const initialAuthState = {
  name: "",
  email: "",
  password: "",
};

export const initialOrgFilterState = {
  search: "",
  isDeleted: false,
  sortBy: "newest",
};

export const initialOrgCreateState = {
  name: "",
  description: "",
  logoUrl: "",
  companyEmail: "",
  companyPhone: "",
  website: "",
  address: "",
  timezone: "",
  defaultLanguage: "",
  businessHours: "",
};

export const initialMemberFilterState = {
  search: "",
  status: "",
  isDeleted: "false",
  limit: 10,
  sortBy: "newest",
};

export const initialRoleFilters = {
  search: "",
  isDeleted: false,
  sortBy: "newest",
};

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
  sortBy: "",
  view: "Grid",
};
export const initialProjectDetailsFilters = {
  search: "",
  status: "",
  priority: "",
  sortBy: "",
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
  sortBy: "",
};
