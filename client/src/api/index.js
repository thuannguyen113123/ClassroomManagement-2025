import loginApi from "./loginApi";
import lessonApi from "./lessonApi";
import studentApi from "./studentApi";

const api = {
  login: loginApi,
  lesson: lessonApi,
  student: studentApi,
};

export default api;
