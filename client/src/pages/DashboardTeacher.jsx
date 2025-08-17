import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DashboardLayout from "../components/dashboard/DashboardLayout";
import studentApi from "../api/studentApi";
import ManageStudents from "../components/students/ManageStudents";
import ManageLessons from "../components/lessons/ManageLessons";
import ChatWindow from "../components/chat/ChatWindow";
import StudentFormModal from "../components/students/StudentFormModal";

export default function DashboardTeacher() {
  const currentUser = useSelector((state) => state.user.currentUser);
  const userId = currentUser?.phone;
  const userRole = currentUser?.role;

  const [students, setStudents] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [activeTab, setActiveTab] = useState("manageStudents");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editingStudent, setEditingStudent] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await studentApi.getAll();
      setStudents(res.data);
    } catch (e) {
      console.error("Lỗi lấy học sinh:", e);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleModalSubmit = async (formData) => {
    try {
      if (modalMode === "create") {
        await studentApi.add({ ...formData, uid: Date.now().toString() });
      } else {
        await studentApi.update(editingStudent.phone, formData);
      }
      fetchStudents();
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  const filteredStudents = students.filter((student) =>
    student.name?.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Teacher Dashboard"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      menuItems={[
        { key: "manageStudents", label: "Manage Students" },
        { key: "manageLessons", label: "Manage Lessons" },
        { key: "messages", label: "Messages" },
      ]}
    >
      {activeTab === "manageStudents" && (
        <ManageStudents
          students={students}
          filteredStudents={filteredStudents}
          filterText={filterText}
          setFilterText={setFilterText}
          openCreateModal={() => {
            setEditingStudent(null);
            setModalMode("create");
            setIsModalOpen(true);
          }}
          openEditModal={(s) => {
            setEditingStudent(s);
            setModalMode("edit");
            setIsModalOpen(true);
          }}
          handleDeleteStudent={(phone) => {
            if (window.confirm("Xác nhận xoá?")) {
              studentApi.delete(phone).then(fetchStudents);
            }
          }}
          handleViewStudentDetails={async (phone) => {
            const res = await studentApi.getByPhone(phone);
            alert(JSON.stringify(res.data, null, 2));
          }}
        />
      )}
      {activeTab === "manageLessons" && <ManageLessons students={students} />}
      {activeTab === "messages" && (
        <ChatWindow userRole={userRole} userId={userId} partners={students} />
      )}

      {isModalOpen && (
        <StudentFormModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleModalSubmit}
          mode={modalMode}
          initialData={editingStudent}
        />
      )}
    </DashboardLayout>
  );
}
