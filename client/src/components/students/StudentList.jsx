import React, { useEffect, useState } from "react";

import studentApi from "./../../api/studentApi";

const StudentList = () => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await studentApi.getAll();
        setStudents(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchStudents();
  }, []);

  return (
    <div>
      <h2>Student List</h2>
      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Lessons</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.uid}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.role}</td>
              <td>
                <ul>
                  {student.assignedLessons.map((lesson) => (
                    <li key={lesson.id}>
                      {lesson.title} - <b>{lesson.status}</b>
                    </li>
                  ))}
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
