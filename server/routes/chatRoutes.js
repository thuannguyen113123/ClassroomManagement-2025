import express from "express";
import {
  getMessagesController,
  postMessageController,
} from "../controllers/chatController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();

// GET lịch sử chat theo roomId
router.get("/:roomId", authMiddleware, getMessagesController);

// POST gửi tin nhắn (tuỳ chọn, nếu dùng REST ngoài socket)
router.post("/:roomId", authMiddleware, postMessageController);

export default router;
