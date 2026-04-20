Task Flow
Created using MERN

- Create Task Flow Project folder structure (app, components, services, hooks, redux)
- Create folder inside Components
- Create Pages inside app (Dashbaord, Setting, login, Projects)
- Create Sidebar and Navbar inside component/layout folder
- Create Dashboard page (create two components Cards.jsx and Section.jsx)
- Add Icons in sidebar using lucide icons
- Designing Projects page (Project Headers, FIlter section)
- Create progress page cantains headers, filter section, list of project contains both list and grid view
- Add routing to Project Cards to open detail of the Project

- Create Kanban Board for task managing
- Create UI of Kanban board (Sections UI, Task UI)
- Add Drag and Drop functionality in kanbaord
- Create Filter section in kanban board
- Create Add task, Manage Members, settings, Add task button UI in project details page header
- Implemented reusable UI
- Created Settings Page in project details (settings/page.jsx)
- Created Dialog for manage members, Add task and Add column in project details page (ManageMember.jsx, NewTaskDialog.jsx, NewColumnDialog.jsx)
- Created Task page details dialog and page where one can perform CRUD on subtask (TaskDetailDialog.jsx, [taskdetails/[taskdetailsid]/page.jsx])
- Add Edit and Delete functionality of column inside TaskSection (TaskSection.jsx, )
- Move Form state value (constant.js)
- Created Reusable UI (TabsCompo.jsx, TaskFooter.jsx, SubTaskStatus.jsx, DeleteDialog.jsx)
- Updated Dummy data
- Update setBoard and moveTask logic and added deleteColumn and addColumn logic (boardSlice.jsx)
- Added Wiplimit when deletion of columns and hide delete button when only one column is left.
- Update UI for Delete Dialog (DeleteDialog.jsx)
- Add New and Delete Column part of kanban Board -- completed
- Created Backlog page (backlogs/page.js) 
- Added Sprint settings like Sprint Dialog for creating, editing and deleting sprint (sprintDialog.jsx)
- Created Header, Filter and stats in Mytask Page(tasks/page.jsx) 