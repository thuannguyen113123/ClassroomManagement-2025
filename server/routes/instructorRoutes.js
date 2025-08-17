import express from "express";
import {
  addStudentController,
  getStudentsController,
  getStudentByPhoneController,
  assignLessonController,
  editStudentByPhoneController,
  deleteStudentByPhoneController,
  viewStudentsController,
} from "./../controllers/instructorController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
function instructorOnly(req, res, next) {
  if (req.user.role !== "instructor") {
    return res.status(403).json({ error: "You do not have access." });
  }
  next();
}

router.post(
  "/addStudent",
  authMiddleware,
  instructorOnly,
  addStudentController
);
router.get("/students", authMiddleware, instructorOnly, getStudentsController);
router.post(
  "/assignLesson",
  authMiddleware,
  instructorOnly,
  assignLessonController
);

// Các route mới thêm
router.get(
  "/:phone",
  authMiddleware,
  instructorOnly,
  getStudentByPhoneController
);
router.put(
  "/editStudent/:phone",
  instructorOnly,
  authMiddleware,
  editStudentByPhoneController
);
router.delete(
  "/student/:phone",
  instructorOnly,
  deleteStudentByPhoneController
);
router.get(
  "/:phone/lessons",
  authMiddleware,
  instructorOnly,
  viewStudentsController
);

export default router;
