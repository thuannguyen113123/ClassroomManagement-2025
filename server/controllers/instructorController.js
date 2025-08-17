import { v4 as uuidv4 } from "uuid";
import nodemailer from "nodemailer";
import { StudentModel } from "../models/studentModel.js";
import LessonModel from "../models/lessonModel.js";

//Thêm hộc sinh
export const addStudentController = async (req, res) => {
  try {
    const { uid, name, phone, email, role, address } = req.body;
    const userRole = role || "student";

    const verificationToken = uuidv4();

    await StudentModel.create(uid, {
      name,
      phone,
      email,
      role: userRole,
      address,
      verified: false,
      verificationToken,
    });

    // Gửi email xác minh
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const verifyUrl = `http://localhost:5173/verify-account?token=${verificationToken}`;

    const mailOptions = {
      from: "20004209@st.vlute.edu.vn",
      to: email,
      subject: "Verify your account - Classroom App",
      html: `
        <h3>Hello ${name},</h3>
        <p>You’ve been added to the Classroom Management App. Click the link below to setup your account:</p>
        <a href="${verifyUrl}">Set up your account</a>
        <p>This link will expire in 24 hours.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: "Added student and sent verification email",
    });
  } catch (error) {
    console.error("Add student error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

// Lấy danh sách học sinh
export const getStudentsController = async (req, res) => {
  try {
    const studentsObj = await StudentModel.getAll();
    const students = Object.entries(studentsObj).map(([uid, student]) => ({
      uid,
      ...student,
    }));
    res.json(students);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Lấy thông tin chi tiết học sinh
export const getStudentByPhoneController = async (req, res) => {
  try {
    const { phone } = req.params;

    const studentsObj = await StudentModel.getAll();
    const students = Object.entries(studentsObj);

    const studentEntry = students.find(
      ([, student]) => student.phone === phone
    );

    if (!studentEntry) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const [uid, student] = studentEntry;

    res.json({
      success: true,
      student: { uid, ...student },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const editStudentByPhoneController = async (req, res) => {
  try {
    const { phone } = req.params;
    const studentsObj = await StudentModel.getAll();
    const students = Object.entries(studentsObj);
    const studentEntry = students.find(
      ([, student]) => student.phone === phone
    );
    if (!studentEntry) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const [uid] = studentEntry;
    await StudentModel.update(uid, req.body);

    res.json({ success: true, message: "Updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const deleteStudentByPhoneController = async (req, res) => {
  try {
    const { phone } = req.params;
    const studentsObj = await StudentModel.getAll();
    const students = Object.entries(studentsObj);
    const studentEntry = students.find(
      ([, student]) => student.phone === phone
    );
    if (!studentEntry) {
      return res
        .status(404)
        .json({ success: false, message: "Student not found" });
    }

    const [uid] = studentEntry;
    await StudentModel.delete(uid);

    res.json({ success: true, message: "Student deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Gán bài học
export const assignLessonController = async (req, res) => {
  try {
    const { uids, title, description } = req.body;

    if (!uids || !title || !description) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required data" });
    }

    await LessonModel.assignToStudents(uids, { title, description });

    res.json({ success: true, message: "The lesson has been assigned" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const viewStudentsController = async (req, res) => {
  try {
    const students = await StudentModel.getAllWithLessons();
    res.json({ success: true, data: students });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
