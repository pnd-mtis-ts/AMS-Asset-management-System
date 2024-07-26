import { createSlice } from "@reduxjs/toolkit";

const toastSlice = createSlice({
  name: "toast",
  initialState: {
    messages: [],
  },
  reducers: {
    addToast: (state, action) => {
      state.messages.push(action.payload);
    },
    removeToast: (state, action) => {
      state.messages = state.messages.filter(
        (msg) => msg.id !== action.payload
      );
    },
    clearMessages: (state) => {
      state.messages = []; // Clear all messages
    },
  },
});

export const { addToast, removeToast, clearMessages } = toastSlice.actions;
export default toastSlice.reducer;
