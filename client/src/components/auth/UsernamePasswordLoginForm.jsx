import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";

export default function UsernamePasswordLoginForm({ onLogin, onBack }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!username || !password) {
      alert("Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu");
      return;
    }
    onLogin(username, password);
  };

  return (
    <>
      <button onClick={onBack} className="text-sm text-gray-500 mb-2">
        <div className="flex justify-center items-center gap-1">
          <IoMdArrowBack fontSize={24} /> <p className="text-[16px]">Back</p>
        </div>
      </button>
      <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          className="w-full px-4 py-2 border rounded-md"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 border rounded-md"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Login
        </button>
      </form>
    </>
  );
}
