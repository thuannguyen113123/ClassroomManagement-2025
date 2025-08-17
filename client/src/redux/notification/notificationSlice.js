import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action) => {
      state.notifications.push({
        id: Date.now(),
        ...action.payload,
        read: false,
      });
    },
    markAsRead: (state, action) => {
      const id = action.payload;
      const notif = state.notifications.find((n) => n.id === id);
      if (notif) notif.read = true;
    },
    clearNotificationByLessonId: (state, action) => {
      const lessonId = action.payload;
      state.notifications = state.notifications.filter(
        (n) => n.lessonId !== lessonId
      );
    },
  },
});

export const { addNotification, markAsRead, clearNotificationByLessonId } =
  notificationSlice.actions;
export default notificationSlice.reducer;
