import express from "express";
import {
  authController,
  loginEmailController,
  loginWithUsernamePassword,
  validateAccessCodeEmail,
} from "../controllers/authController.js";

const router = express.Router();

// Phone login
router.post("/createAccessCode", authController.createAccessCode);
router.post("/validateAccessCode", authController.validateAccessCode);

// Email login
router.post("/loginEmail", loginEmailController);
router.post("/validateAccessCodeEmail", validateAccessCodeEmail);
router.post("/loginUsername", loginWithUsernamePassword);

export default router;
