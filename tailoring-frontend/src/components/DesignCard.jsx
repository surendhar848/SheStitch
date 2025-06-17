import React from "react";

export default function DesignCard({ design, onChat, animate }) {
  return (
    <div className={`border p-4 rounded shadow bg-white cursor-pointer ${animate ? "hover:scale-105 transition" : ""}`}>
      <img src={design.imageUrl} alt="Design" className="w-full h-48 object-cover rounded" />
      <h4 className="text-lg font-bold mt-2">{design.title}</h4>
      <p>{design.description}</p>
      <p className="text-sm text-gray-500 mt-1">Contact: {design.contact}</p>
      <button className="mt-2 bg-blue-500 text-white px-3 py-1 rounded" onClick={onChat}>Chat</button>
    </div>
  );
}