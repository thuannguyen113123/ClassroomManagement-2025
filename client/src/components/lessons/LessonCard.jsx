import React from "react";

const LessonCard = ({ lesson, onMarkDone }) => {
  return (
    <div style={{ border: "1px solid gray", padding: 10, marginBottom: 10 }}>
      <h3>{lesson.title}</h3>
      <p>{lesson.description}</p>
      <p>Status: {lesson.done ? "Done" : "Not Done"}</p>
      {!lesson.done && (
        <button onClick={() => onMarkDone(lesson.id)}>Mark as Done</button>
      )}
    </div>
  );
};

export default LessonCard;
