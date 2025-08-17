import { db } from "../configs/firebase.js";
import { ref, set, get, update, remove, push } from "firebase/database";

export const StudentModel = {
  async create(uid, data) {
    await set(ref(db, `students/${uid}`), {
      ...data,
      createdAt: Date.now(),
      assignedLessons: [],
    });
  },

  async findById(uid) {
    const snapshot = await get(ref(db, `students/${uid}`));
    return snapshot.exists() ? snapshot.val() : null;
  },

  async update(uid, data) {
    await update(ref(db, `students/${uid}`), data);
  },

  async delete(uid) {
    await remove(ref(db, `students/${uid}`));
  },

  async getAll() {
    const snapshot = await get(ref(db, `students`));
    return snapshot.exists() ? snapshot.val() : {};
  },

  async assignLesson(uid, lesson) {
    const lessonRef = push(ref(db, `students/${uid}/assignedLessons`));
    await set(lessonRef, {
      ...lesson,
      status: "pending",
      assignedAt: Date.now(),
    });
  },
  async getAllWithLessons() {
    const snapshot = await get(ref(db, `students`));
    const studentsObj = snapshot.exists() ? snapshot.val() : {};

    return Object.entries(studentsObj).map(([uid, student]) => ({
      uid,
      ...student,
      lessons: student.assignedLessons
        ? Object.values(student.assignedLessons)
        : [],
    }));
  },
  async getUserByPhone(phone) {
    const snapshot = await get(ref(db, `students`));
    if (!snapshot.exists()) return null;

    const students = snapshot.val();
    for (const uid in students) {
      if (students[uid].phone === phone) {
        return { uid, ...students[uid] };
      }
    }

    return null;
  },

  //Thêm: Tìm học sinh theo token
  async findByToken(token) {
    const snapshot = await get(ref(db, `students`));
    if (!snapshot.exists()) return null;

    const students = snapshot.val();
    for (const uid in students) {
      if (students[uid].verificationToken === token) {
        return { uid, ...students[uid] };
      }
    }

    return null;
  },

  // Tìm học sinh theo username
  async findByUsername(username) {
    const snapshot = await get(ref(db, `students`));
    if (!snapshot.exists()) return null;

    const students = snapshot.val();
    for (const uid in students) {
      if (students[uid].username === username) {
        return { uid, ...students[uid] };
      }
    }

    return null;
  },
  async findByEmail(email) {
    const snapshot = await get(ref(db, `students`));
    if (!snapshot.exists()) return null;

    const students = snapshot.val();
    for (const uid in students) {
      if (students[uid].email === email) {
        return { uid, ...students[uid] };
      }
    }

    return null;
  },
};
