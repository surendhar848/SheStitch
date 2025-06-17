export default function ChatSidebar({ profile, chats, selectedId, onSelect, userProfiles, unreadMap }) {
  return (
    <div className="w-72 bg-white border-r shadow h-full flex flex-col overflow-y-auto">
      <div className="p-4 font-bold text-lg border-b bg-gradient-to-r from-green-200 to-blue-200">Chats</div>
      <div className="flex-1">
        {chats.length === 0 ? (
          <div className="p-4 text-gray-400">No chats yet</div>
        ) : (
          chats.map((chat, idx) => {
            const user = userProfiles[chat.with] || {};
            return (
              <div
                key={idx}
                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50 transition ${selectedId === chat.with ? "bg-blue-100" : ""}`}
                onClick={() => onSelect(chat.with)}
              >
                <img src={user.photoUrl || "https://via.placeholder.com/40"} className="w-10 h-10 rounded-full border-2 object-cover" alt="" />
                <div className="flex-1">
                  <div className="font-semibold">{user.fullName || chat.with}</div>
                  <div className="text-xs text-gray-400 truncate">{chat.lastMsg || "No messages yet"}</div>
                </div>
                {unreadMap[chat.with] > 0 && (
                  <div className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">{unreadMap[chat.with]}</div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}