import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import React from "react";

import Login from "./pages/Login";
import DashboardTeacher from "./pages/DashboardTeacher";
import DashboardStudent from "./pages/DashboardStudent";
import VerifyAccount from "./pages/VerifyAccount";
import PrivateRoute from "./components/routes/PrivateRoute";
import GlobalLoadingModal from "./components/ui/GlobalLoadingModal";

function App() {
  return (
    <>
      <GlobalLoadingModal />
      <BrowserRouter>
        <Routes>
          <Route path="/sign-in" element={<Login />} />
          <Route path="/verify-account" element={<VerifyAccount />} />

          <Route element={<PrivateRoute />}>
            <Route
              path="/instructor/dashboard"
              element={<DashboardTeacher />}
            />
            <Route path="/student/dashboard" element={<DashboardStudent />} />
          </Route>

          <Route path="*" element={<Navigate to="/sign-in" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
