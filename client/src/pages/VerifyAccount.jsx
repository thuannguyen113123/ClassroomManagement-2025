import React, { useState } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyAccount() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const token = query.get("token");
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8080/student/setupAccount", {
        token,
        username,
        password,
      });
      setMessage("Account has been successfully set up. You can be login!");
      navigate("/login");
    } catch (error) {
      setMessage("Error: " + (error.response?.data?.error || error.message));
    }
  };
  if (!token) {
    alert(" Token is invalid or expired. Please login again.");
    return null;
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-6 text-center text-gray-800">
        Set up an account
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input
          type="text"
          placeholder="Chọn tên đăng nhập"
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={username}
          required
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Tạo mật khẩu"
          className="px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md font-medium transition"
        >
          Confirm
        </button>
      </form>

      {message && (
        <p
          className={`mt-6 text-center ${
            message.startsWith("Error")
              ? "text-red-600"
              : "text-green-600 font-semibold"
          }`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
