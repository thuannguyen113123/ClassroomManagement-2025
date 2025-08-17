import React, { useState } from "react";

import { useSelector } from "react-redux";
import lessonApi from "../../api/lessonApi";

export default function ManageLessons({ students }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]);

  const currentUser = useSelector((state) => state.user.currentUser);

  const handleCheckboxChange = (uid) => {
    setSelectedStudents((prev) =>
      prev.includes(uid) ? prev.filter((id) => id !== uid) : [...prev, uid]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!currentUser.token) {
      alert("No token. Please login again.");
      return;
    }

    if (!title || !description || selectedStudents.length === 0) {
      alert("Please enter completely and select at least one student.");
      return;
    }

    try {
      await lessonApi.assign({
        uids: selectedStudents,
        title,
        description,
      });
      alert("Lesson assigned!");
      setTitle("");
      setDescription("");
      setSelectedStudents([]);
    } catch (error) {
      console.error(error);
      alert("Unable to deliver lesson:" + error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow max-w-xl">
      <h2 className="text-xl font-semibold mb-4">Assign Lessons</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-2">Assign to Students</label>
          <div className="max-h-48 overflow-y-auto border border-gray-300 rounded p-2">
            {students.map((student) => (
              <label key={student.uid} className="block">
                <input
                  type="checkbox"
                  checked={selectedStudents.includes(student.uid)}
                  onChange={() => handleCheckboxChange(student.uid)}
                  className="mr-2"
                />
                {student.name}
              </label>
            ))}
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Assign
        </button>
      </form>
    </div>
  );
}
