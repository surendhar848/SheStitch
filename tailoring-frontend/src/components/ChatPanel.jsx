import React, { useState, useEffect, useRef } from "react";

// Universal ChatPanel component for both seller and customer
export default function ChatPanel({
  userId,
  otherId,
  userRoleId,
  otherRoleId,
  senderName,
  receiverName,
}) {
  const [chatId, setChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // Ensure chat room exists and fetch its id
  useEffect(() => {
    async function getOrCreateChat() {
      const res = await fetch("http://localhost:8000/api/chat_s", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sender_id: userId,
          receiver_id: otherId,
          sender_role_id: userRoleId,
          created_by: userId,
        }),
      });
      if (res.ok) {
        const chat = await res.json();
        setChatId(chat?.id ?? null);
      }
    }
    if (userId && otherId && userRoleId && otherRoleId) getOrCreateChat();
  }, [userId, otherId, userRoleId, otherRoleId]);

  // Fetch messages for this chat
  useEffect(() => {
    if (!chatId) return;
    async function fetchMessages() {
      const res = await fetch(`http://localhost:8000/api/chat_message_s/${chatId}`);
      if (res.ok) {
        const msgs = await res.json();
        setMessages(Array.isArray(msgs) ? msgs.filter(Boolean) : []);
      }
    }
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [chatId]);

  // Always scroll to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!input.trim() || !chatId) return;
    const newMsg = {
      message: input,
      sender_id: userId,
      sender_role_id: userRoleId,
      receiver_id: otherId,
      msg_type: "text",
    };
    const res = await fetch(`http://localhost:8000/api/chat_message_s/${chatId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newMsg),
    });
    if (res.ok) {
      const saved = await res.json();
      setMessages((prev) => [...prev, saved]);
      setInput("");
    }
  }

  return (
    <div className="bg-white/90 shadow-xl rounded-xl w-full mt-8 animate__animated animate__fadeIn">
      <div className="flex items-center gap-3 p-4 border-b bg-gradient-to-r from-green-200 to-blue-200">
        <div>
          <div className="font-bold text-lg text-green-700">{receiverName || "Chat"}</div>
        </div>
      </div>
      <div className="p-6 h-96 overflow-y-auto bg-gradient-to-br from-white to-blue-50">
        {(messages || [])
          .filter((msg) => msg && typeof msg === "object" && "id" in msg)
          .map((msg, idx) => (
            <div
              key={msg.id || idx}
              className={`mb-2 flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender_id === userId ? "bg-green-500 text-white" : "bg-gray-200"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))}
        <div ref={chatEndRef} />
      </div>
      <div className="p-4 border-t bg-white flex gap-2">
        <input
          className="flex-1 border rounded px-3 py-2 focus:ring-2 focus:ring-green-300"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-green-600 text-white px-5 py-2 rounded hover:bg-green-700 transition"
          onClick={sendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
}