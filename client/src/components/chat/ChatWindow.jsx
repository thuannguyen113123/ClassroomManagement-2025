import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";

const socket = io("http://localhost:8080");

const getToken = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    return currentUser?.token || null;
  } catch {
    return null;
  }
};

export default function ChatWindow({ userRole, userId, partners = [] }) {
  const [user, setUser] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    setUser({
      role: userRole,
      phone: userId,
      uid: userId,
    });
  }, [userRole, userId]);

  const filteredPartners = partners.filter((p) =>
    (p.name || p.username || p.phone || "")
      .toLowerCase()
      .includes(searchText.toLowerCase())
  );

  const roomId = selectedUser
    ? [user?.phone || user?.uid, selectedUser?.phone || selectedUser?.uid]
        .sort()
        .join("-")
    : null;

  useEffect(() => {
    if (!roomId) return;

    socket.emit("join-room", { roomId });
    setMessages([]);

    const token = getToken();
    if (!token) return;

    axios
      .get(`http://localhost:8080/chats/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.success) {
          setMessages(res.data.messages);
        }
      })
      .catch((err) => {
        console.error("Error fetching messages:", err);
      });

    const handleReceiveMessage = (message) => {
      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive-message", handleReceiveMessage);

    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!newMessage.trim() || !roomId || !user) return;

    const message = {
      sender: user.phone || user.uid,
      text: newMessage,
      timestamp: Date.now(),
    };

    socket.emit("send-message", { roomId, message });
    setMessages((prev) => [...prev, message]);
    setNewMessage("");
  };

  return (
    <div className="flex h-[80vh] bg-white rounded-lg overflow-hidden border">
      <div className="w-1/4 border-r p-4 bg-gray-50 flex flex-col">
        <h2 className="font-semibold mb-2">All Messages</h2>
        <input
          type="text"
          placeholder={`Search ${
            userRole === "instructor" ? "students" : "teachers"
          }...`}
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full mb-4 px-2 py-1 border rounded text-sm"
        />
        <div className="space-y-2 overflow-y-auto flex-1">
          {filteredPartners.length === 0 && (
            <p className="text-gray-500 text-sm">No users found.</p>
          )}
          {filteredPartners.map((p) => (
            <div
              key={p.uid || p.phone}
              onClick={() => setSelectedUser(p)}
              className={`cursor-pointer px-3 py-2 rounded hover:bg-blue-100 flex items-center gap-2 ${
                selectedUser?.uid === p.uid
                  ? "bg-blue-100 font-medium"
                  : "bg-white"
              }`}
            >
              <div className="w-6 h-6 rounded-full bg-blue-400 text-white flex items-center justify-center text-sm font-semibold">
                {(p.name || p.username || "U")[0].toUpperCase()}
              </div>
              <div>
                <div>{p.name || p.username || p.phone}</div>
                <div className="text-xs text-gray-500">
                  {p.role === "instructor"
                    ? "Teacher"
                    : p.role === "student"
                    ? "Student"
                    : ""}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b px-4 py-2 bg-gray-100 flex items-center justify-between">
          <div>
            <strong>
              {selectedUser
                ? selectedUser.name || selectedUser.username
                : "Select a user to chat"}
            </strong>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-white">
          {selectedUser ? (
            messages.length > 0 ? (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`mb-2 max-w-xs p-2 rounded-lg text-sm ${
                    msg.sender === (user?.phone || user?.uid)
                      ? "bg-blue-100 ml-auto text-right"
                      : "bg-gray-200"
                  }`}
                >
                  <p>{msg.text}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(msg.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400 mt-10">
                No messages yet.
              </p>
            )
          ) : (
            <p className="text-center text-gray-400 mt-10">
              Please select a user to start chatting.
            </p>
          )}
        </div>

        {selectedUser && (
          <div className="p-4 border-t flex gap-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="flex-1 border rounded px-3 py-2 text-sm"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
