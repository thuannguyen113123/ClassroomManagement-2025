import bcrypt from "bcrypt";
import { StudentModel } from "../models/studentModel.js";
import { ChatModel } from "../models/chatModel.js";
import { UserModel } from "../models/userModel.js";

export const setupAccountController = async (req, res) => {
  const { token, username, password } = req.body;

  try {
    const student = await StudentModel.findByToken(token);
    const existingUser = await StudentModel.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Username đã tồn tại." });
    }
    if (!student) {
      return res
        .status(400)
        .json({ error: "Token không hợp lệ hoặc đã hết hạn." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await StudentModel.update(student.uid, {
      username,
      password: hashedPassword,
      verified: true,
      verificationToken: "",
    });

    await UserModel.updateUser(student.phone, {
      username,
      hashedPassword,
      role: "student",
      phone: student.phone,
      name: student.name,
      email: student.email,
    });

    res.json({
      success: true,
      message: "Account has been successfully set up",
    });
  } catch (err) {
    res.status(500).json({ error: "Error server" });
  }
};

export const editProfileController = async (req, res) => {
  const { name, email } = req.body;
  const { phone } = req.params;

  if (!phone) {
    return res.status(400).json({ error: "Phone is required." });
  }

  try {
    const student = await StudentModel.getUserByPhone(phone);

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email;

    await StudentModel.update(student.uid, updateData);

    const updatedStudent = await StudentModel.findById(student.uid);

    return res.json(updatedStudent);
  } catch (error) {
    console.error("Error in editProfileController:", error);
    return res.status(500).json({ error: "Server error." });
  }
};

export const getMyLessonsController = async (req, res) => {
  const phone = req.query.phone;
  if (!phone) return res.status(400).json({ error: "phone is required" });

  try {
    const student = await StudentModel.getUserByPhone(phone);
    if (!student) return res.status(404).json({ error: "No students found" });

    res.json({ lessons: student.assignedLessons || [] });
  } catch (error) {
    console.error("Error while getting lesson:", error);
    res.status(500).json({ error: "Error server" });
  }
};

export const markLessonDoneController = async (req, res) => {
  const { phone, lessonId } = req.body;
  if (!phone || !lessonId)
    return res.status(400).json({ error: "Phone and lessonId are required" });

  try {
    const student = await StudentModel.getUserByPhone(phone);
    if (!student) return res.status(404).json({ error: "No students found" });

    const lessonsObj = student.assignedLessons || {};

    const lessonKey = Object.keys(lessonsObj).find(
      (key) => lessonsObj[key].id === lessonId
    );

    if (!lessonKey) {
      return res.status(404).json({ error: "No lesson found" });
    }

    // Cập nhật trạng thái bài học trong Firebase
    await StudentModel.update(student.uid, {
      [`assignedLessons/${lessonKey}/status`]: "done",
      [`assignedLessons/${lessonKey}/doneAt`]: Date.now(),
    });

    const updatedStudent = await StudentModel.findById(student.uid);
    const updatedLessons = updatedStudent.assignedLessons
      ? Object.values(updatedStudent.assignedLessons)
      : [];

    res.json({ success: true, lessons: updatedLessons });
  } catch (error) {
    res.status(500).json({ error: "Error server", detail: error.message });
  }
};
export const getInstructorsController = async (req, res) => {
  try {
    const instructorsObj = await ChatModel.getAllInstructors();
    const instructors = Object.entries(instructorsObj).map(
      ([uid, instructor]) => ({
        uid,
        ...instructor,
      })
    );
    res.json(instructors);
  } catch (error) {
    console.error("Error when getting instructors:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};
