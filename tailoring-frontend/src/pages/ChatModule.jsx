import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import ChatPanel from "../components/ChatPanel";

export default function ChatModule() {
  const { userRole, userId, otherId } = useParams();
  const navigate = useNavigate();

  // You may fetch user/seller names with these IDs for display if you wish
  const userRoleId = Number(userRole);
  const otherRoleId = userRoleId === 1 ? 2 : 1;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-green-100 to-blue-100 relative">
      <button
        className="absolute top-6 left-6 px-4 py-2 rounded bg-blue-500 text-white"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <div className="w-full max-w-2xl">
        <ChatPanel
          userId={userId}
          otherId={otherId}
          userRoleId={userRoleId}
          otherRoleId={otherRoleId}
        />
      </div>
    </div>
  );
}