import { ChatModel } from "../models/chatModel.js";

//Lấy toàn bộ tin nhắn trong một room (theo roomId)
export const getMessagesController = async (req, res) => {
  const { roomId } = req.params;

  if (!roomId) {
    return res.status(400).json({ error: "roomId is required" });
  }

  try {
    const messages = await ChatModel.getMessages(roomId);
    res.json({ success: true, messages });
  } catch (err) {
    res.status(500).json({ error: "Error server" });
  }
};

//Lưu tin nhắn mới vào room
export const postMessageController = async (req, res) => {
  const { roomId } = req.params;
  const { sender, text } = req.body;

  if (!roomId || !sender || !text) {
    return res.status(400).json({
      error: "roomId, sender and text are required",
    });
  }

  try {
    const message = {
      sender,
      text,
      timestamp: Date.now(),
    };

    await ChatModel.saveMessage(roomId, message);

    res.status(201).json({ success: true, message });
  } catch (err) {
    res.status(500).json({ error: "Erorr server" });
  }
};
