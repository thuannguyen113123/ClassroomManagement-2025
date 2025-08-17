import axios from "axios";

const BASE_URL = "http://localhost:8080";

const loginApi = {
  loginWithEmail: (email) =>
    axios.post(`${BASE_URL}/auth/loginEmail`, { email }),

  loginWithPhone: (phoneNumber) =>
    axios.post(`${BASE_URL}/auth/createAccessCode`, { phoneNumber }),

  verifyEmailCode: (email, accessCode) =>
    axios.post(`${BASE_URL}/auth/validateAccessCodeEmail`, {
      email,
      accessCode,
    }),

  verifyPhoneCode: (phoneNumber, accessCode) =>
    axios.post(`${BASE_URL}/auth/validateAccessCode`, {
      phoneNumber,
      accessCode,
    }),

  loginWithUsername: (username, password) =>
    axios.post(`${BASE_URL}/auth/loginUsername`, {
      username,
      password,
    }),
};

export default loginApi;
