import React, { useEffect, useState } from "react";
import ChatPanel from "../components/ChatPanel";

export default function SellerChatsPage({ profile }) {
  const sellerId = profile?.seller?.id || profile?.id;
  const [chats, setChats] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    if (!sellerId) return;
    async function fetchChats() {
      try {
        const res = await fetch(`http://localhost:8000/api/seller_chats/${sellerId}`);
        if (res.ok) {
          const data = await res.json();
          setChats(data);
        } else {
          setChats([]);
        }
      } catch (e) {
        setChats([]);
      }
    }
    fetchChats();
  }, [sellerId]);

  if (!sellerId) {
    return <div className="flex items-center justify-center min-h-screen">Loading seller info...</div>;
  }

  return (
    <div className="flex min-h-screen">
      {/* Left sidebar: Customer list */}
      <div className="w-72 bg-white border-r">
        <div className="font-bold p-4 text-green-700">User chats</div>
        <ul>
          {chats.length === 0 ? (
            <li className="p-4 text-gray-400">No chats yet</li>
          ) : (
            chats.map(c => (
              <li
                key={c.customer_id}
                className={`p-4 cursor-pointer hover:bg-green-100 ${
                  selectedCustomer?.id === c.customer_id ? "bg-green-200" : ""
                }`}
                onClick={() => setSelectedCustomer({ id: c.customer_id, name: c.customer_name })}
              >
                <div className="font-semibold">{c.customer_name}</div>
                <div className="text-xs text-gray-500 truncate">{c.last_message}</div>
              </li>
            ))
          )}
        </ul>
      </div>
      {/* Main panel: Chat */}
      <div className="flex-1 flex flex-col items-center justify-center">
        {selectedCustomer ? (
          <ChatPanel
            userId={sellerId}
            otherId={selectedCustomer.id}
            userRoleId={2}
            otherRoleId={1}
            senderName={profile?.seller?.shop_name || profile?.name}
            receiverName={selectedCustomer.name}
          />
        ) : (
          <div className="text-gray-400">Select a customer</div>
        )}
      </div>
    </div>
  );
}