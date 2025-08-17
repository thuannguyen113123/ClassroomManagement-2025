// models/lessonModel.js
import { db } from "../configs/firebase.js";
import { ref, set, get, update, remove, push } from "firebase/database";

export const LessonModel = {
  async create(lessonData) {
    const id = Date.now().toString();
    const newLesson = {
      id,
      ...lessonData,
      status: "assigned",
      createdAt: new Date().toISOString(),
    };
    await set(ref(db, `lessons/${id}`), newLesson);
    return newLesson;
  },

  async findById(id) {
    const snapshot = await get(ref(db, `lessons/${id}`));
    return snapshot.exists() ? snapshot.val() : null;
  },

  async getAll() {
    const snapshot = await get(ref(db, `lessons`));
    return snapshot.exists() ? snapshot.val() : {};
  },

  async update(id, data) {
    await update(ref(db, `lessons/${id}`), data);
  },

  async delete(id) {
    await remove(ref(db, `lessons/${id}`));
  },

  async assignToStudents(uids, lessonData) {
    // Tạo bài học rồi gán cho từng học sinh
    const lesson = await this.create(lessonData);

    const promises = uids.map(async (uid) => {
      const lessonRef = push(ref(db, `students/${uid}/assignedLessons`));
      await set(lessonRef, {
        ...lesson,
        status: "pending",
        assignedAt: Date.now(),
      });
    });

    await Promise.all(promises);
    return lesson;
  },

  async markLessonDone(uid, lessonId) {
    // Cập nhật trạng thái bài học assigned của học sinh thành "done"
    const snapshot = await get(ref(db, `students/${uid}/assignedLessons`));
    if (!snapshot.exists()) return false;

    const lessons = snapshot.val();
    for (const key in lessons) {
      if (lessons[key].id === lessonId) {
        await update(ref(db, `students/${uid}/assignedLessons/${key}`), {
          status: "done",
          completedAt: Date.now(),
        });
        return true;
      }
    }
    return false;
  },

  async getStudentLessons(uid) {
    const snapshot = await get(ref(db, `students/${uid}/assignedLessons`));
    return snapshot.exists() ? snapshot.val() : {};
  },
  async getAllWithLessons() {
    const studentsSnapshot = await get(ref(db, "students"));
    if (!studentsSnapshot.exists()) return [];

    const students = studentsSnapshot.val();
    const studentList = [];

    for (const uid in students) {
      const student = students[uid];
      const assignedLessons = await LessonModel.getStudentLessons(uid);

      studentList.push({
        uid,
        ...student,
        assignedLessons: Object.values(assignedLessons),
      });
    }

    return studentList;
  },
};

export default LessonModel;
