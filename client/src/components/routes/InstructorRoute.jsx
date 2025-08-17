import React from "react";
import { useSelector } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";

const InstructorRoute = () => {
  const { currentUser } = useSelector((state) => state.user);

  return currentUser?.user?.role === "instructor" ? (
    <Outlet />
  ) : (
    <Navigate to="/sign-in" />
  );
};

export default InstructorRoute;
