import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    columns: {}
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

            const taskIndex = source.tasks.findIndex(t => t.id === taskId);
            if (taskIndex === -1) return;

            // Remove that task whose status is changed
            const [task] = source.tasks.splice(taskIndex, 1);

            if (sourceCol === destCol) {
                // Reorder the task with a column
                source.tasks.splice(overIndex, 0, task);
            } else {
                // Move the task to the new column and columnId
                dest.tasks.splice(overIndex, 0, {
                    ...task,
                    columnId: destCol
                });
            }

            // Recalculate order
            Object.values(state.columns).forEach(col => {
                col.tasks.forEach((t, i) => {
                    t.order = (i + 1) * 1000;
                });
            });
        }
    }
});

export const { setBoard, moveTask } = boardSlice.actions;
export default boardSlice.reducer;