import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  columns: {},
  columnOrder: [],
  columnTaskIds: {},
  tasks: {},
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard(state, action) {
      const project = action.payload;

      state.columns = project.columns;
      state.columnOrder = project.columnOrder;
      state.columnTaskIds = project.columnTaskIds;
      state.tasks = project.tasks;
    },

    moveTask(state, action) {
      const { taskId, sourceCol, destCol, overIndex } = action.payload;

      const sourceIds = state.columnTaskIds[sourceCol];
      const destIds = state.columnTaskIds[destCol];

      if (!sourceIds || !destIds) return;

      const oldIndex = sourceIds.indexOf(taskId);
      if (oldIndex === -1) return;

      // remove from source column
      sourceIds.splice(oldIndex, 1);

      // insert into destination column
      destIds.splice(overIndex, 0, taskId);

      const task = state.tasks[taskId];

      // update columnId if moved
      if (sourceCol !== destCol) {
        task.columnId = destCol;
      }

      // reordering of task
      const tasksInDest = destIds.map((id) => state.tasks[id]);

      const prev = tasksInDest[overIndex - 1];
      const next = tasksInDest[overIndex + 1];

      if (!prev && !next) {
        task.columnOrder = 1000;
      } else if (!prev) {
        task.columnOrder = next.columnOrder / 2;
      } else if (!next) {
        task.columnOrder = prev.columnOrder + 1000;
      } else {
        task.columnOrder = (prev.columnOrder + next.columnOrder) / 2;
      }
    },

    deleteColumn(state, action) {
      const { columnId, targetColumnId } = action.payload;

      if (!state.columns[columnId]) return;

      if (targetColumnId && state.columnTaskIds[targetColumnId]) {
        // copying the deleted column task
        const tasksToMove = [...(state.columnTaskIds[columnId] || [])];

        // adding task
        state.columnTaskIds[targetColumnId].push(...tasksToMove);

        // Update each task's columnId
        tasksToMove.forEach((taskId) => {
          if (state.tasks[taskId]) {
            state.tasks[taskId].columnId = targetColumnId;
          }
        });
      }

      // Delete column from all places
      delete state.columns[columnId];
      delete state.columnTaskIds[columnId];

      // Remove from columnOrder
      state.columnOrder = state.columnOrder.filter((id) => id !== columnId);
    },

    addColumn(state, action) {
      const { id, title, wipLimit } = action.payload;
      // prevent duplicates
      if (state.columns[id]) return;

      // add column
      state.columns[id] = {
        id,
        title,
        wipLimit: wipLimit || null,
      };

      // initial task list
      state.columnTaskIds[id] = [];

      // update order
      state.columnOrder.push(id);
    },
  },
});

export const { setBoard, moveTask, deleteColumn, addColumn } =
  boardSlice.actions;
export default boardSlice.reducer;
