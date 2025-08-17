import React from "react";
import { useSelector } from "react-redux";
import { FiLoader } from "react-icons/fi";

const GlobalLoadingModal = () => {
  const isLoading = useSelector((state) => state.ui.isLoading);

  if (!isLoading) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
    >
      <div className="flex flex-col items-center space-y-4">
        <FiLoader className="animate-spin text-white text-4xl" />
        <p className="text-white text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default GlobalLoadingModal;
