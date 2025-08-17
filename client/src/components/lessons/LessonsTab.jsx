import React from "react";

import lessonApi from "../../api/lessonApi";
import { useSelector } from "react-redux";

export default function LessonsTab({ lessons, onUpdateLesson }) {
  const user = useSelector((state) => state.user.currentUser);
  const handleMarkDone = async (lessonId) => {
    try {
      await lessonApi.markDone(user.phone, lessonId);
      onUpdateLesson(lessonId);
    } catch {
      alert("Không thể đánh dấu bài học là hoàn thành!");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Assigned Lessons</h2>
      {lessons.length === 0 ? (
        <p className="text-gray-500 italic">No lessons assigned yet</p>
      ) : (
        lessons.map(({ id, title, description, status }) => (
          <div key={id} className="bg-white p-4 rounded shadow mb-4">
            <h3 className="text-lg font-bold">{title}</h3>
            <p className="text-sm text-gray-600">{description}</p>
            <p className="text-sm mt-2">
              Status:{" "}
              <span
                className={
                  status.toLowerCase() === "done"
                    ? "text-green-600"
                    : "text-yellow-600"
                }
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            </p>
            {status.toLowerCase() !== "done" && (
              <button
                onClick={() => handleMarkDone(id)}
                className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Mark as Done
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}
