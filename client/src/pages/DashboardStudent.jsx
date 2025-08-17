import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import lessonApi from "../api/lessonApi";
import LessonsTab from "./../components/lessons/LessonsTab";
import ChatWindow from "../components/chat/ChatWindow";
import ProfileTab from "./../components/profile/ProfileTab";
import axios from "axios";

export default function DashboardStudent() {
  const currentUser = useSelector((state) => state.user.currentUser);

  const [activeTab, setActiveTab] = useState("lessons");
  const [lessons, setLessons] = useState([]);
  const [partners, setPartners] = useState([]);

  const phone = currentUser?.phone;
  const role = currentUser?.role;

  useEffect(() => {
    if (!phone) return;
    lessonApi
      .getByStudentPhone(phone)
      .then((res) => {
        const lessonsData = res?.data?.lessons || {};
        setLessons(Object.values(lessonsData));
      })
      .catch((err) => console.error("Error loading lessons", err));
  }, [phone]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = currentUser?.token;
        if (!token) return;

        const url =
          role === "student"
            ? "http://localhost:8080/student/instructors"
            : "http://localhost:8080/instructor/students";

        const res = await axios.get(url, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPartners(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchPartners();
  }, [role, currentUser]);

  return (
    <DashboardLayout
      title="Student Dashboard"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      menuItems={[
        { key: "lessons", label: "My Lessons" },
        { key: "profile", label: "My Profile" },
        { key: "messages", label: "Messages" },
      ]}
    >
      {activeTab === "lessons" && (
        <LessonsTab
          lessons={lessons}
          onUpdateLesson={(id) => {
            setLessons((prev) =>
              prev.map((l) => (l.id === id ? { ...l, status: "Done" } : l))
            );
          }}
        />
      )}
      {activeTab === "profile" && <ProfileTab user={currentUser} />}
      {activeTab === "messages" && (
        <ChatWindow userRole={role} userId={phone} partners={partners} />
      )}
    </DashboardLayout>
  );
}
