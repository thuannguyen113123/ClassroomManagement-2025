import {
  ref,
  push,
  get,
  child,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { db } from "../configs/firebase.js";

export const ChatModel = {
  async saveMessage(roomId, message) {
    const chatRef = ref(db, `chats/${roomId}`);
    await push(chatRef, message);
  },

  async getMessages(roomId) {
    const snapshot = await get(ref(db, `chats/${roomId}`));
    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    return Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
  },

  async getAllStudents() {
    try {
      const studentsQuery = query(
        ref(db, "users"),
        orderByChild("role"),
        equalTo("student")
      );
      const snapshot = await get(studentsQuery);
      return snapshot.val() || {};
    } catch (err) {
      throw new Error("Error when getting student list: " + err.message);
    }
  },

  async getAllInstructors() {
    try {
      const instructorsQuery = query(
        ref(db, "users"),
        orderByChild("role"),
        equalTo("instructor")
      );
      const snapshot = await get(instructorsQuery);
      return snapshot.val() || {};
    } catch (err) {
      throw new Error("Error getting teacher list: " + err.message);
    }
  },
};
