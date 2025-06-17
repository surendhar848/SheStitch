import React, { useEffect, useState, useRef } from "react";

export default function SellerChatPanel({ sellerId, sellerProfile }) {
  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);

  // Fetch all chats for this seller
  useEffect(() => {
    if (!sellerId) return;
    fetch(`http://localhost:8000/api/chat_s/seller/${sellerId}`)
      .then(res => res.json())
      .then(setChats);
  }, [sellerId]);

  // Fetch messages for the selected chat
  useEffect(() => {
    if (!selectedChat) return;
    fetch(`http://localhost:8000/api/chat_message_s/${selectedChat.id}`)
      .then(res => res.json())
      .then(setMessages);
  }, [selectedChat]);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send a message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedChat) return;
    const payload = {
      message: messageInput,
      sender_id: sellerProfile.id,
      sender_role_id: sellerProfile.role_id || 2, // 2 = seller, adjust as needed
      receiver_id: selectedChat.sender_id === sellerProfile.id
        ? selectedChat.receiver_id
        : selectedChat.sender_id,
      msg_type: "text",
    };
    await fetch(`http://localhost:8000/api/chat_message_s/${selectedChat.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setMessageInput("");
    fetch(`http://localhost:8000/api/chat_message_s/${selectedChat.id}`)
      .then(res => res.json())
      .then(setMessages);
  };

  return (
    <div className="flex border rounded-lg shadow-lg overflow-hidden h-[400px] mt-10 w-full bg-white">
      {/* Chat list */}
      <div className="w-1/3 border-r bg-gray-50">
        <h3 className="text-lg font-bold p-2 text-green-700">Chats</h3>
        <ul>
          {chats.map(chat => (
            <li
              key={chat.id}
              className={`p-2 cursor-pointer hover:bg-green-100 ${selectedChat && selectedChat.id === chat.id ? "bg-green-200" : ""}`}
              onClick={() => setSelectedChat(chat)}
            >
              {chat.sender_id === sellerProfile.id
                ? `To: ${chat.receiver_id}`
                : `From: ${chat.sender_id}`}
            </li>
          ))}
        </ul>
      </div>
      {/* Message panel */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4">
          {selectedChat ? (
            <>
              {messages.map(msg => (
                <div key={msg.id}
                  className={`mb-2 flex ${msg.sender_id === sellerProfile.id ? "justify-end" : "justify-start"}`}>
                  <div className={`p-2 rounded-lg ${msg.sender_id === sellerProfile.id ? "bg-green-500 text-white" : "bg-gray-200"}`}>
                    {msg.message}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="text-gray-400 text-center pt-10">Select a chat to view messages</div>
          )}
        </div>
        {/* Message input */}
        {selectedChat && (
          <form className="flex border-t bg-gray-50 p-2" onSubmit={handleSend}>
            <input
              className="flex-1 border rounded p-2 mr-2"
              placeholder="Type a message..."
              value={messageInput}
              onChange={e => setMessageInput(e.target.value)}
            />
            <button className="bg-green-600 text-white px-4 py-2 rounded" type="submit">Send</button>
          </form>
        )}
      </div>
    </div>
  );
}