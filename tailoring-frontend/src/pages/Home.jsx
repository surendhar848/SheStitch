import React from "react";
import { useNavigate } from "react-router-dom";
import DesignCard from "../components/DesignCard";

export default function Home({ profile, designs }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center p-6">
      {/* Seller Profile */}
      <div className="flex items-center gap-6 mb-8 p-6 bg-white/80 rounded-xl shadow-lg animate__animated animate__fadeInDown">
        <img src={profile.photoUrl} alt="Seller" className="w-28 h-28 rounded-full border-4 border-green-400 shadow" />
        <div>
          <h1 className="text-3xl font-bold text-green-700">{profile.fullName}</h1>
          <div className="text-xl text-blue-600">{profile.tailoringName}</div>
          <div className="mt-2 text-gray-700">{profile.address}</div>
          <div className="text-gray-500">{profile.phone} | {profile.email}</div>
        </div>
      </div>
      {/* Designs */}
      <h2 className="text-2xl font-semibold text-blue-700 mb-4">Available Designs</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {designs.map((design, idx) => (
          <DesignCard
            key={idx}
            design={design}
            onChat={() => navigate("/chat")}
            animate
          />
        ))}
      </div>
    </div>
  );
}