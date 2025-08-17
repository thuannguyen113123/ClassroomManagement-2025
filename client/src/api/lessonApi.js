import axiosClient from "../utils/axiosClient";

const lessonApi = {
  getByStudentPhone: (phone) =>
    axiosClient.get(`/student/myLessons?phone=${phone}`),
  markDone: (phone, lessonId) =>
    axiosClient.post("/student/markLessonDone", { phone, lessonId }),
  assign: ({ uids, title, description }) =>
    axiosClient.post("/instructor/assignLesson", {
      uids,
      title,
      description,
    }),
};

export default lessonApi;
