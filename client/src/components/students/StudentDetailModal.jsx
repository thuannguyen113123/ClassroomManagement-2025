import React from "react";

export default function StudentDetailModal({ isOpen, onClose, student }) {
  if (!isOpen || !student) return null;

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
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto">
        <h2 className="text-2xl font-semibold text-center mb-6">
          Student Details
        </h2>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <strong>Name:</strong> {student.name}
          </div>
          <div>
            <strong>Phone:</strong> {student.phone}
          </div>
          <div>
            <strong>Email:</strong> {student.email}
          </div>
          <div>
            <strong>Role:</strong> {student.role}
          </div>
          <div className="col-span-2">
            <strong>Address:</strong> {student.address || "-"}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-3">Assigned Lessons</h3>
          {student.assignedLessons && student.assignedLessons.length > 0 ? (
            <table className="w-full border-collapse text-left text-sm">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border px-3 py-2">Title</th>
                  <th className="border px-3 py-2">Status</th>
                  <th className="border px-3 py-2">Created At</th>
                </tr>
              </thead>
              <tbody>
                {student.assignedLessons.map((lesson) => (
                  <tr key={lesson.id}>
                    <td className="border px-3 py-2">{lesson.title}</td>
                    <td className="border px-3 py-2">{lesson.status}</td>
                    <td className="border px-3 py-2">
                      {new Date(lesson.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>This student has no assigned lessons.</p>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-md hover:bg-gray-100"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
