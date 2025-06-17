import React from "react";

export default function ChatBox({ text, sender, customerPhoto, sellerPhoto }) {
  const isCustomer = sender === "customer";
  return (
    <div className={`flex items-end mb-3 ${isCustomer ? "justify-start" : "justify-end"}`}>
      {isCustomer && <img src={customerPhoto} alt="" className="w-8 h-8 rounded-full mr-2 border-2 border-green-300" />}
      <div className={`px-4 py-2 rounded-2xl shadow ${isCustomer ? "bg-green-100 text-gray-700" : "bg-green-500 text-white animate-bounce-in-right"}`}>
        {text}
      </div>
      {!isCustomer && <img src={sellerPhoto} alt="" className="w-8 h-8 rounded-full ml-2 border-2 border-green-400" />}
      <style>
        {`
          @keyframes bounce-in-right {
            0% { opacity: 0; transform: translateX(80px) scale(0.8);}
            80% { opacity: 1; transform: translateX(-10px) scale(1.05);}
            100% { opacity: 1; transform: translateX(0) scale(1);}
          }
          .animate-bounce-in-right {
            animation: bounce-in-right 0.4s;
          }
        `}
      </style>
    </div>
  );
}