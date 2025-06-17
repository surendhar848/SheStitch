import React, { useEffect, useState, useRef } from "react";

export default function CustomerChatPanel({ userId, userRoleId, sellerId, sellerName }) {
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  // Find or create chat with this seller
  useEffect(() => {
    if (!userId || !sellerId) return;
    fetch(`http://localhost:8000/api/chat_s/user/${userId}`)
      .then(res => res.json())
      .then(chats => {
        let found = chats.find(
          c =>
            (String(c.sender_id) === String(userId) && String(c.receiver_id) === String(sellerId)) ||
            (String(c.receiver_id) === String(userId) && String(c.sender_id) === String(sellerId))
        );
        if (found) {
          setChat(found);
        } else {
          // Create new chat if not exists
          fetch(`http://localhost:8000/api/chat_s`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sender_id: userId,
              receiver_id: sellerId,
              sender_role_id: userRoleId,
              created_by: userId,
            }),
          })
            .then(res => res.json())
            .then(newChat => setChat(newChat));
        }
      });
  }, [userId, sellerId, userRoleId]);

  // Fetch messages for chat
  useEffect(() => {
    if (!chat) return;
    fetch(`http://localhost:8000/api/chat_message_s/${chat.id}`)
      .then(res => res.json())
      .then(setMessages);
  }, [chat]);

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !chat) return;
    const payload = {
      message: messageInput,
      sender_id: userId,
      sender_role_id: userRoleId,
      receiver_id: sellerId,
      msg_type: "text",
    };
    await fetch(`http://localhost:8000/api/chat_message_s/${chat.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setMessageInput("");
    fetch(`http://localhost:8000/api/chat_message_s/${chat.id}`)
      .then(res => res.json())
      .then(setMessages);
  };

  if (!chat) return <div className="my-6 text-gray-500">Loading chat...</div>;

  return (
    <div className="flex flex-col border rounded-lg shadow-lg overflow-hidden h-[400px] mt-8 w-full bg-white">
      <div className="bg-green-100 p-2 font-bold text-green-700">
        {sellerName ? `Chat with ${sellerName}` : "Chat with Seller"}
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {messages.length > 0 ? (
          messages.map(msg => (
            <div
              key={msg.id}
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
          ))
        ) : (
          <div className="text-gray-400 text-center pt-10">No messages yet.</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <form className="flex border-t bg-gray-50 p-2" onSubmit={handleSend}>
        <input
          className="flex-1 border rounded p-2 mr-2"
          placeholder="Type a message..."
          value={messageInput}
          onChange={e => setMessageInput(e.target.value)}
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">
          Send
        </button>
      </form>
    </div>
  );
}