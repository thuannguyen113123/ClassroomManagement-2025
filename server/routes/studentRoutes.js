import express from "express";
import {
  editProfileController,
  getMyLessonsController,
  markLessonDoneController,
  setupAccountController,
  getInstructorsController,
} from "../controllers/studentController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/setupAccount", setupAccountController);
router.get("/myLessons", authMiddleware, getMyLessonsController);
router.post("/markLessonDone", authMiddleware, markLessonDoneController);
router.put("/editProfile/:phone", authMiddleware, editProfileController);
router.get("/instructors", authMiddleware, getInstructorsController);

export default router;
