import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import SellerDashboard from "./pages/SellerDashboard";
import CustomerDashboard from "./pages/CustomerDashboard";
import ChatPage from "./pages/ChatPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SellerListPage from "./pages/SellerListPage";
import SellerChatsPage from "./pages/SellerChatsPage"; // <-- NEW: Seller's chat list page

function App() {
  const [profile, setProfile] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Restore profile from localStorage on first load (so dashboards work after refresh)
  useEffect(() => {
    if (!profile) {
      const stored = localStorage.getItem("userProfile");
      if (stored) {
        setProfile(JSON.parse(stored));
      }
    }
  }, [profile]);

  useEffect(() => {
    async function fetchSellers() {
      setLoading(true);
      setError("");
      try {
        // Use your real API endpoint here
        const res = await fetch("http://localhost:8000/api/sellers");
        if (!res.ok) {
          throw new Error("Failed to fetch sellers");
        }
        const data = await res.json();
        // Normalize seller data
        const normalized = data.map(seller => ({
          id: seller.id,
          fullName: seller.full_name || seller.fullName,
          tailoringName: seller.shop_name || seller.tailoringName,
          phone: seller.phone_number || seller.phone,
          address: seller.shop_address || seller.address,
          email: seller.email,
          photoUrl: seller.photo_url || seller.photoUrl,
          gstNumber: seller.gst_number || seller.gstNumber,
          designs: Array.isArray(seller.portfolios)
            ? seller.portfolios.map(design => ({
                imageUrl: design.image_url,
                title: design.title,
                description: design.description,
                contact: design.contact,
              }))
            : [],
        }));
        setSellers(normalized);
      } catch (err) {
        setError("Unable to load sellers. Please try again later.");
        setSellers([]);
      }
      setLoading(false);
    }
    fetchSellers();
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-blue-100 animate-bgMove">
        <Routes>
          <Route path="/" element={<Login setProfile={setProfile} />} />
          <Route path="/login" element={<Login setProfile={setProfile} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/home" element={<Home profile={profile} />} />
          <Route path="/seller" element={
            <SellerDashboard
              profile={profile}
              setProfile={setProfile}
            />
          } />
          {/* Seller's chat list page with left-side customer list */}
          <Route
            path="/seller/chats"
            element={<SellerChatsPage profile={profile} />}
          />
          <Route path="/customer" element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen text-xl">Loading sellers...</div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-screen text-xl text-red-600">{error}</div>
            ) : (
              <SellerListPage sellers={sellers} />
            )
          } />
          <Route path="/customer/:sellerId" element={
            loading ? (
              <div className="flex items-center justify-center min-h-screen text-xl">Loading seller details...</div>
            ) : error ? (
              <div className="flex items-center justify-center min-h-screen text-xl text-red-600">{error}</div>
            ) : (
              <CustomerDashboard sellers={sellers} userProfile={profile} />
            )
          } />
          {/* Full-screen chat for both roles, with params */}
          <Route
            path="/chat/:userRole/:userId/:otherId"
            element={<ChatPage profile={profile} />}
          />
          {/* Fallback: for old style /chat with query params (optional) */}
          <Route path="/chat" element={<ChatPage profile={profile} />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;