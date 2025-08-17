import React, { useRef, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { HiOutlineMenu } from "react-icons/hi";
import { BsPerson } from "react-icons/bs";
import { FiLogOut } from "react-icons/fi";
import NotificationBell from "../ui/NotificationBell";
import { useDispatch, useSelector } from "react-redux";

import { signout } from "../../redux/user/userSlice";

export default function DashboardLayout({
  title,
  activeTab,
  setActiveTab,
  menuItems,
  children,
}) {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [menuOpen, setMenuOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const profileMenuRef = useRef(null);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <header className="flex justify-between items-center h-16 px-6 bg-white shadow-md relative">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-600 hover:text-gray-900 focus:outline-none"
            aria-label="Toggle Menu"
          >
            <HiOutlineMenu size={24} />
          </button>
          <h1 className="text-lg font-bold">{title}</h1>
        </div>

        <div className="flex items-center space-x-4 relative">
          <div className="w-6 h-6 flex items-center justify-center">
            <NotificationBell />
          </div>
          <div
            className="relative flex items-center justify-center"
            ref={profileMenuRef}
          >
            <button
              onClick={() => setProfileMenuOpen(!profileMenuOpen)}
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              aria-label="User Profile"
            >
              <CgProfile size={24} />
            </button>

            {profileMenuOpen && (
              <div className="absolute right-0 top-full mt-1 w-40 bg-white shadow-lg rounded-md z-50 overflow-hidden border">
                {currentUser.role === "student" && (
                  <button
                    onClick={() => {
                      setActiveTab("profile");
                      setProfileMenuOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                  >
                    <BsPerson className="mr-2" /> My Profile
                  </button>
                )}
                <button
                  onClick={() => {
                    dispatch(signout());
                    window.location.reload();
                  }}
                  className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 text-gray-700"
                >
                  <FiLogOut className="mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {menuOpen && (
          <aside
            ref={menuRef}
            className="w-64 bg-white p-6 shadow-md overflow-y-auto"
          >
            <nav className="space-y-4 text-sm text-gray-700">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`block w-full text-left ${
                    activeTab === item.key
                      ? "font-semibold text-blue-600 border-l-4 border-blue-600 pl-2"
                      : "hover:text-blue-600"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>
        )}

        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
