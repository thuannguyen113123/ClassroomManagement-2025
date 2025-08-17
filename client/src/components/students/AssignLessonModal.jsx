import React, { useState, useEffect } from "react";

export default function AssignLessonModal({
  isOpen,
  onClose,
  students,
  onAssign,
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);

  useEffect(() => {
    if (!isOpen) {
      setTitle("");
      setDescription("");
      setSelectedStudentIds([]);
    }
  }, [isOpen]);

  const toggleStudentSelection = (id) => {
    setSelectedStudentIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    if (!title.trim() || selectedStudentIds.length === 0) {
      alert("Please enter a lesson title and select at least one student");
      return;
    }
    onAssign({ title, description, assignedTo: selectedStudentIds });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96 max-h-[80vh] overflow-auto">
        <h2 className="text-xl font-bold mb-4">Deliver Lessons</h2>

        <div className="mb-3">
          <label className="block mb-1 font-semibold">Title lesson</label>
          <input
            type="text"
            className="w-full border rounded px-3 py-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-semibold">Describe</label>
          <textarea
            className="w-full border rounded px-3 py-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label className="block mb-1 font-semibold">Select students</label>
          <div className="max-h-48 overflow-auto border rounded p-2">
            {students.map((student) => (
              <label key={student.uid} className="block">
                <input
                  type="checkbox"
                  checked={selectedStudentIds.includes(student.uid)}
                  onChange={() => toggleStudentSelection(student.uid)}
                  className="mr-2"
                />
                {student.name} ({student.email})
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded border hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Assign assignments
          </button>
        </div>
      </div>
    </div>
  );
}
