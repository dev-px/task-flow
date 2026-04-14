import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  columns: {},
};

const boardSlice = createSlice({
  name: "board",
  initialState,
  reducers: {
    setBoard(state, action) {
      state.columns = action.payload;
    },

    moveTask(state, action) {
      const { taskId, sourceCol, destCol, overIndex } = action.payload;

      const source = state.columns[sourceCol];
      const dest = state.columns[destCol];

      const taskIndex = source.tasks.findIndex((t) => t.id === taskId);
      if (taskIndex === -1) return;

      const [task] = source.tasks.splice(taskIndex, 1);

      let newTask = task;

      if (sourceCol !== destCol) {
        newTask = { ...task, columnId: destCol };
      }

      // Insert temporarily
      dest.tasks.splice(overIndex, 0, newTask);

      // 🧠 SMART ORDERING
      const prev = dest.tasks[overIndex - 1];
      const next = dest.tasks[overIndex + 1];

      if (!prev && !next) {
        // only item
        newTask.columnOrder = 1000;
      } else if (!prev) {
        // top
        newTask.columnOrder = next.columnOrder / 2;
      } else if (!next) {
        // bottom
        newTask.columnOrder = prev.columnOrder + 1000;
      } else {
        // middle
        newTask.columnOrder = (prev.columnOrder + next.columnOrder) / 2;
      }
    },
  },
});

export const { setBoard, moveTask } = boardSlice.actions;
export default boardSlice.reducer;
