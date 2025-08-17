import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
});
axiosClient.interceptors.request.use((config) => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const token = currentUser?.token;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
export default axiosClient;
