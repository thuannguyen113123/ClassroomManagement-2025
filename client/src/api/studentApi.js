import axiosClient from "../utils/axiosClient";

const studentApi = {
  getAll: () => axiosClient.get("/instructor/students"),
  getByPhone: (phone) => axiosClient.get(`/instructor/student/${phone}`),
  add: (data) => axiosClient.post("/instructor/addStudent", data),
  update: (phone, data) =>
    axiosClient.put(`/instructor/editStudent/${phone}`, data),
  delete: (phone) => axiosClient.delete(`/instructor/student/${phone}`),
  updateProfileStudent: (phone, data) =>
    axiosClient.put(`/student/editProfile/${phone}`, data),
};

export default studentApi;
