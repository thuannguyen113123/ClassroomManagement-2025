import React, { useState } from "react";

export default function SignInForm({ method, setMethod, onNext }) {
  const [input, setInput] = useState("");

  //Xữ lý khi không nhập gì
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) {
      alert("Please enter information.");
      return;
    }
    onNext(input.trim());
  };

  return (
    <>
      <h2 className="text-3xl font-bold mb-4 text-center">Sign In</h2>

      {method === "email" ? (
        <p className="text-sm text-center mb-4">
          Please enter your email to sign in
        </p>
      ) : method === "phone" ? (
        <p className="text-sm text-center mb-4">
          Please enter your phone to sign in
        </p>
      ) : (
        <p className="text-sm text-center mb-4 text-gray-600">
          Please click login to proceed to username & password login.
        </p>
      )}

      {method !== "username" ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type={method === "email" ? "email" : "tel"}
            placeholder={
              method === "email" ? "Your Email Address" : "Your Phone Number"
            }
            className="w-full px-4 py-2 border rounded-md"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md"
          >
            Next
          </button>
        </form>
      ) : (
        <div className="text-center">
          <button
            onClick={() => onNext("")}
            className="bg-blue-500 text-white px-6 py-2 rounded-md"
          >
            Login with Username & Password
          </button>
        </div>
      )}

      <div className="mt-6 text-center space-y-2 text-sm">
        {method !== "email" && (
          <button
            onClick={() => {
              setMethod("email");
              setInput("");
            }}
            className="text-blue-500 hover:underline block w-full"
          >
            Login with Email
          </button>
        )}
        {method !== "phone" && (
          <button
            onClick={() => {
              setMethod("phone");
              setInput("");
            }}
            className="text-blue-500 hover:underline block w-full"
          >
            Login with Phone
          </button>
        )}
        {method !== "username" && (
          <button
            onClick={() => {
              setMethod("username");
              setInput("");
            }}
            className="text-blue-500 hover:underline block w-full"
          >
            Login with Username & Password
          </button>
        )}
      </div>
    </>
  );
}
