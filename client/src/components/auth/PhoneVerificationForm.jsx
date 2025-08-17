import React, { useState } from "react";
import { IoMdArrowBack } from "react-icons/io";

export default function PhoneVerificationForm({ phone, onBack, onVerify }) {
  const [code, setCode] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (code.trim().length !== 6) {
      alert("Code must be 6 digits");
      return;
    }
    onVerify(phone, code);
  };

  return (
    <>
      <button onClick={onBack} className="text-sm text-gray-500 mb-2">
        <div className="flex justify-center items-center gap-1">
          <IoMdArrowBack fontSize={24} /> <p className="text-[16px]">Back</p>
        </div>
      </button>
      <h2 className="text-xl font-bold mb-4 text-center">Phone verification</h2>
      <p className="text-sm text-center mb-4">
        Please enter your code that was sent to your phone
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
        <a
          href="#"
          onClick={() => onVerify(phone, "resend")}
          className="text-blue-500"
        >
          Send again
        </a>
      </p>
    </>
  );
}
