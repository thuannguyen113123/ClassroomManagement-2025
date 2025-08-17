import React, { useState } from "react";

import CreateStudentModal from "./StudentFormModal";
import StudentDetailModal from "./StudentDetailModal";

export default function ManageStudents({
  students,
  filteredStudents,
  filterText,
  setFilterText,
  openCreateModal,
  openEditModal,
  handleDeleteStudent,
  handleModalSubmit,
  editingStudent,
  modalMode,
  isModalOpen,
  setIsModalOpen,
}) {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Hàm mở modal xem chi tiết học sinh
  const handleViewStudentDetails = (phone) => {
    const student = students.find((s) => s.phone === phone);
    if (!student) return;

    const detailedStudent = {
      ...student,
      assignedLessons: Object.values(student.assignedLessons || {}),
    };

    setSelectedStudent(detailedStudent);
    setIsDetailOpen(true);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold">Manage Students</h2>
          <p className="text-gray-600">{filteredStudents.length} Students</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={openCreateModal}
            className="border px-4 py-2 rounded-md text-blue-600 border-blue-500 hover:bg-blue-50"
          >
            + Add Student
          </button>
          <input
            type="text"
            placeholder="Filter"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            className="border rounded-md px-3 py-2 text-sm"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-sm text-gray-700">
              <th className="px-4 py-2 border-b">Student Name</th>
              <th className="px-4 py-2 border-b">Email</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student.uid} className="text-sm">
                <td className="px-4 py-3 border-b">{student.name}</td>
                <td
                  className="px-4 py-3 border-b text-blue-600 underline cursor-pointer"
                  onClick={() => handleViewStudentDetails(student.phone)}
                >
                  {student.email}
                </td>
                <td className="px-4 py-3 border-b">
                  <span className="bg-green-100 text-green-700 px-2 py-1 rounded-md text-xs">
                    {student.status || "Active"}
                  </span>
                </td>
                <td className="px-4 py-3 border-b space-x-2">
                  <button
                    onClick={() => openEditModal(student)}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDeleteStudent(student.phone)}
                    className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <CreateStudentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingStudent}
        mode={modalMode}
      />

      <StudentDetailModal
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        student={selectedStudent}
      />
    </div>
  );
}
