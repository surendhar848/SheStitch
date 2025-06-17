import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function CustomerDashboard({ sellers, userProfile }) {
  const { sellerId } = useParams();
  const navigate = useNavigate();
  const selectedSellerId = sellerId || localStorage.getItem("selectedSellerId");
  const userId = userProfile?.id || localStorage.getItem("userId");
  const userRoleId = 1; // 1 = customer

  if (!Array.isArray(sellers) || sellers.length === 0) {
    return <div className="flex items-center justify-center min-h-screen text-gray-600">No sellers found.</div>;
  }
  const seller = sellers.find(s => String(s.id) === String(selectedSellerId));
  if (!seller) return <div className="flex items-center justify-center min-h-screen text-gray-600">Seller not found.</div>;

  const designs = Array.isArray(seller.designs)
    ? seller.designs
    : Array.isArray(seller.portfolios)
      ? seller.portfolios.map(d => ({
          imageUrl: d.image_url,
          title: d.title,
          description: d.description,
          contact: d.contact,
        }))
      : [];

  return (
    <div className="flex flex-col items-center p-6">
      <div className="bg-white/80 p-4 rounded-xl shadow-lg mb-8 w-full max-w-2xl">
        <div className="flex items-center gap-6">
          <img
            src={seller.photoUrl || seller.photo_url || "/default-profile.png"}
            alt="Seller"
            className="w-24 h-24 rounded-full border-4 border-green-400 shadow"
          />
          <div>
            <h1 className="text-2xl font-bold text-green-700">{seller.tailoringName || seller.shop_name}</h1>
            {(seller.address || seller.shop_address) && (
              <div className="text-base text-blue-600">{seller.address || seller.shop_address}</div>
            )}
            {(seller.phone || seller.phone_number) && (
              <div className="text-base text-gray-700">{seller.phone || seller.phone_number}</div>
            )}
          </div>
        </div>
        <button
          className="mt-4 bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          onClick={() => {
            if (userId) {
              // Use new URL pattern for chat page
              navigate(`/chat/${userRoleId}/${userId}/${seller.id}`);
            }
          }}
        >
          Chat with Seller
        </button>
      </div>
      <h2 className="text-xl font-semibold text-blue-700 mb-4">All Designs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {designs.length > 0 ? (
          designs.map((design, idx) => (
            <div
              key={design.id || idx}
              className="bg-white rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img src={design.imageUrl || design.image_url} alt={design.title} className="h-32 w-full object-cover rounded mb-2" />
              <div className="text-lg font-semibold text-green-700">{design.title}</div>
              <div className="text-gray-600">{design.description}</div>
              {design.contact && (
                <div className="text-gray-500 text-xs mt-1">{design.contact}</div>
              )}
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 my-8 w-full">
            No designs posted yet.
          </div>
        )}
      </div>
    </div>
  );
}