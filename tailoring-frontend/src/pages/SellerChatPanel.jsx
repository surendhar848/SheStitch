import React from "react";

export default function SellerChatPanel({ messages = [] }) {
  // Defensive logging
  console.log("messages in SellerChatPanel", messages);

  return (
    <div>
      {(messages || [])
        .filter(msg => msg && typeof msg.id !== "undefined" && msg.id !== null)
        .map(msg => (
          <div key={msg.id}>{msg.message}</div>
        ))
      }
    </div>
  );
}