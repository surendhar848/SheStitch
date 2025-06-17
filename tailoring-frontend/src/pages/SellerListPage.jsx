import React from "react";
import { useNavigate } from "react-router-dom";

export default function SellerListPage({ sellers }) {
  const navigate = useNavigate();

  if (!Array.isArray(sellers) || sellers.length === 0) {
    return (
      <div className="flex flex-col items-center p-8">
        <h1 className="text-3xl font-bold mb-8 text-green-700">Select a Seller</h1>
        <div className="text-gray-400 text-lg">No sellers found. Please try again later.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-8">
      <h1 className="text-3xl font-bold mb-8 text-green-700">Select a Seller</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl">
        {sellers.map((seller) => {
          const designs = Array.isArray(seller.designs) ? seller.designs : [];
          const firstPortfolio = designs[0];
          return (
            <div
              key={seller.id}
              className="bg-white rounded-xl shadow-lg p-6 flex flex-col items-center hover:scale-105 transition cursor-pointer"
              onClick={() => {
                // Save selected seller id for later use
                localStorage.setItem("selectedSellerId", seller.id);
                navigate(`/customer/${seller.id}`);
              }}
            >
              {firstPortfolio ? (
                <img
                  src={firstPortfolio.imageUrl}
                  alt={firstPortfolio.title}
                  className="h-48 w-full object-cover rounded mb-4"
                />
              ) : (
                <div className="h-48 w-full flex items-center justify-center bg-gray-100 rounded mb-4 text-gray-400">
                  No design posted
                </div>
              )}
              <h2 className="text-xl font-bold text-green-700 mb-2">{seller.tailoringName}</h2>
              <div className="text-gray-700 text-sm">{seller.address}</div>
              <div className="text-gray-500 text-sm">{seller.phone}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}