import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  sendCodeStart,
  sendCodeSuccess,
  sendCodeFailure,
  verifyCodeStart,
  verifyCodeSuccess,
  verifyCodeFailure,
} from "../redux/user/userSlice.js";
import { startLoading, stopLoading } from "../redux/ui/uiSlice.js";
import api from "../api";
import SignInForm from "../components/auth/SignInForm.jsx";
import EmailVerificationForm from "../components/auth/EmailVerificationForm.jsx";
import PhoneVerificationForm from "../components/auth/PhoneVerificationForm.jsx";
import UsernamePasswordLoginForm from "../components/auth/UsernamePasswordLoginForm.jsx";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [method, setMethod] = useState("email");
  const [step, setStep] = useState("signin");
  const [userInput, setUserInput] = useState("");

  // Chuẩn hóa về đầu +84 để không bị lỗi ở twilio
  const normalizePhoneNumber = (phone) => {
    if (!phone) return "";
    const cleaned = phone.replace(/\D/g, "");
    if (cleaned.startsWith("0")) return "+84" + cleaned.slice(1);
    if (cleaned.startsWith("84")) return "+84" + cleaned.slice(2);
    if (cleaned.startsWith("8")) return "+84" + cleaned;
    if (cleaned.startsWith("+84")) return cleaned;
    return phone;
  };

  const handleNext = async (input) => {
    setUserInput(input);
    dispatch(startLoading());
    dispatch(sendCodeStart());

    try {
      if (method === "email") {
        await api.login.loginWithEmail(input);
        dispatch(sendCodeSuccess());
        setStep("verify-email");
      } else if (method === "phone") {
        const normalizedPhone = normalizePhoneNumber(input);
        await api.login.loginWithPhone(normalizedPhone);
        dispatch(sendCodeSuccess());
        setStep("verify-phone");
      }
    } catch (err) {
      dispatch(
        sendCodeFailure(err.response?.data?.error || "Sending code failed")
      );
      alert(err.response?.data?.error || "Sending code failed");
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleVerifyEmail = async (code) => {
    dispatch(startLoading());
    dispatch(verifyCodeStart());

    try {
      const res = await api.login.verifyEmailCode(userInput, code);
      dispatch(verifyCodeSuccess(res.data));

      navigate(
        res.data.role === "instructor"
          ? "/instructor/dashboard"
          : "/student/dashboard"
      );
    } catch (err) {
      dispatch(
        verifyCodeFailure(err.response?.data?.error || "Verification failed")
      );
      alert(err.response?.data?.error || "Verification failed");
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleVerifyPhone = async (phone, code) => {
    dispatch(startLoading());
    dispatch(verifyCodeStart());

    const normalizedPhone = normalizePhoneNumber(phone);

    try {
      const res = await api.login.verifyPhoneCode(normalizedPhone, code);
      dispatch(verifyCodeSuccess(res.data));

      navigate(
        res.data.role === "instructor"
          ? "/instructor/dashboard"
          : "/student/dashboard"
      );
    } catch (err) {
      dispatch(
        verifyCodeFailure(err.response?.data?.error || "Verification failed")
      );
      alert(err.response?.data?.error || "Verification failed");
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleUsernameLogin = async (username, password) => {
    dispatch(startLoading());
    dispatch(sendCodeStart());

    try {
      const res = await api.login.loginWithUsername(username, password);
      dispatch(verifyCodeSuccess(res.data));

      navigate(
        res.data.role === "instructor"
          ? "/instructor/dashboard"
          : "/student/dashboard"
      );
    } catch (err) {
      dispatch(sendCodeFailure(err.response?.data?.error || "Login failed"));
      alert(err.response?.data?.error || "Login failed");
    } finally {
      dispatch(stopLoading());
    }
  };

  const handleBack = () => {
    if (step === "verify-email" || step === "verify-phone") {
      setStep("signin");
      setUserInput("");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 shadow-md rounded-md w-full max-w-sm">
        {step === "signin" && method === "username" && (
          <UsernamePasswordLoginForm
            onLogin={handleUsernameLogin}
            onBack={() => setMethod("email")}
          />
        )}

        {step === "signin" && (method === "email" || method === "phone") && (
          <SignInForm
            method={method}
            setMethod={setMethod}
            onNext={handleNext}
          />
        )}

        {step === "verify-email" && (
          <EmailVerificationForm
            email={userInput}
            onBack={handleBack}
            onSuccess={handleVerifyEmail}
          />
        )}

        {step === "verify-phone" && (
          <PhoneVerificationForm
            phone={userInput}
            onBack={handleBack}
            onVerify={handleVerifyPhone}
          />
        )}
      </div>
    </div>
  );
}
