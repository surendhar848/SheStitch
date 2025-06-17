import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import ChatPanel from "../components/ChatPanel";

// This ChatPage supports both full-screen direct chat (with params) and fallback for old /chat route with query string params.
export default function ChatPage({ profile }) {
  const params = useParams();
  const location = useLocation();

  // Try to extract IDs/roles from URL params (preferred) or fallback to query params
  let userRole, userId, otherId, receiverName;

  if (params.userRole && params.userId && params.otherId) {
    userRole = Number(params.userRole);
    userId = Number(params.userId);
    otherId = Number(params.otherId);
  } else {
    // Fallback: parse from query string, e.g. /chat?userRole=1&userId=12&otherId=44
    const qs = new URLSearchParams(location.search);
    userRole = Number(qs.get("userRole") || profile?.role_id);
    userId = Number(qs.get("userId") || profile?.id);
    otherId = Number(qs.get("otherId"));
  }

  // Set sender/receiver roles for ChatPanel
  let userRoleId = userRole;
  let otherRoleId = userRole === 2 ? 1 : 2; // 1: customer, 2: seller

  // Try to determine receiver name
  if (otherRoleId === 2 && profile?.seller?.shop_name) {
    receiverName = profile.seller.shop_name;
  } else {
    receiverName = ""; // You may fetch receiver name if needed
  }

  // Don't render ChatPanel unless both IDs are present
  if (!userId || !otherId || !userRoleId || !otherRoleId) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-600">
        Unable to load chat: missing user information.
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-green-50 to-blue-100">
      <div className="w-full max-w-2xl">
        <ChatPanel
          userId={userId}
          otherId={otherId}
          userRoleId={userRoleId}
          otherRoleId={otherRoleId}
          senderName={profile?.seller?.shop_name || profile?.name}
          receiverName={receiverName}
        />
      </div>
    </div>
  );
}