import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/authRoutes.js";
import instructorRouter from "./routes/instructorRoutes.js";
import studentRouter from "./routes/studentRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import { ChatModel } from "./models/chatModel.js";

dotenv.config();

const app = express();

// Tạo HTTP server dựa trên app Express
const server = createServer(app);

// Tạo Socket.IO server gắn lên server HTTP
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// Middleware Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Các route
app.use("/instructor", instructorRouter);
app.use("/auth", authRoutes);
app.use("/student", studentRouter);
app.use("/chats", chatRouter);

// Khởi động server HTTP
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server chạy trên port ${PORT}`);
});

// Biến toàn cục lưu online users
global.onlinUsers = new Map();

// Xử lý kết nối Socket.IO
io.on("connection", (socket) => {
  // Tham gia room
  socket.on("join-room", ({ roomId }) => {
    socket.join(roomId);
  });

  // Nhận tin nhắn gửi lên
  socket.on("send-message", async ({ roomId, message }) => {
    try {
      // Lưu tin nhắn (ở đây bạn gọi model lưu vào DB hoặc Firebase)
      await ChatModel.saveMessage(roomId, message);

      // Gửi tin nhắn cho những client khác trong phòng (trừ người gửi)
      socket.to(roomId).emit("receive-message", message);
    } catch (err) {
      console.error(err);
    }
  });
});
