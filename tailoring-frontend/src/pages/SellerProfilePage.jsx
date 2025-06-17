import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function SellerProfilePage({ sellers }) {
  const { sellerId } = useParams();
  const navigate = useNavigate();

  if (!Array.isArray(sellers) || sellers.length === 0) {
    return <div className="p-10 text-gray-500 text-center">No sellers found.</div>;
  }

  const seller = sellers.find(s => String(s.id) === String(sellerId));
  if (!seller) {
    return <div className="p-10 text-red-700 font-bold">Seller Not Found</div>;
  }

  return (
    <div className="flex flex-col items-center p-6">
      <div className="bg-white/80 p-4 rounded-xl shadow-lg mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-6">
          <img src={seller.photoUrl} alt="Seller" className="w-24 h-24 rounded-full border-4 border-green-400 shadow" />
          <div>
            <h1 className="text-2xl font-bold text-green-700">{seller.fullName}</h1>
            <div className="text-lg text-blue-600">{seller.tailoringName}</div>
            <div className="mt-1 text-gray-700">{seller.gstNumber}</div>
            <div className="text-gray-500">{seller.email}</div>
            <div className="text-gray-500">{seller.phone}</div>
            <div className="text-gray-400 text-xs">{seller.address}</div>
          </div>
        </div>
        <button
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          onClick={() => navigate(`/chat?sellerId=${seller.id}`)}
        >
          Chat with Seller
        </button>
      </div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">All Designs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {seller.designs && seller.designs.length > 0 ? (
          seller.designs.map((design, idx) => (
            <div
              key={idx}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img src={design.imageUrl} alt={design.title} className="h-32 w-full object-cover rounded mb-2" />
              <div className="text-lg font-semibold text-green-700">{design.title}</div>
              <div className="text-gray-600">{design.description}</div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 my-8 w-full">No designs posted yet.</div>
        )}
      </div>
    </div>
  );
}