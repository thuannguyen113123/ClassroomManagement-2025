import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";

export default function EmailVerificationForm({ email, onBack, onSuccess }) {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim().length === 6) {
      onSuccess(code);
    } else {
      alert("Please enter a valid 6-digit code.");
    }
  };

  return (
    <>
      <button onClick={onBack} className="text-sm text-gray-500 mb-2">
        <div className="flex justify-center items-center gap-1">
          <IoMdArrowBack fontSize={24} /> <p className="text-[16px]">Back</p>
        </div>
      </button>
      <h2 className="text-xl font-bold mb-4 text-center">Email verification</h2>
      <p className="text-sm text-center mb-4">
        Please enter the code sent to <strong>{email}</strong>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Enter your code"
          className="w-full px-4 py-2 border rounded-md"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded-md"
        >
          Submit
        </button>
      </form>
      <p className="text-xs text-center mt-2 text-gray-500">
        Code not received?{" "}
        <a href="#" className="text-blue-500">
          Send again
        </a>
      </p>
    </>
  );
}
