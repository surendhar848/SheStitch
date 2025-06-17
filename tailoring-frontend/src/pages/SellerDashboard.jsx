import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ProfileModal from "../components/ProfileModal";

function getDisplayProfile(profile) {
  if (!profile) {
    return {
      fullName: "",
      tailoringName: "",
      address: "",
      phone: "",
      eid: "",
      email: "",
      photoUrl: "/default.png",
    };
  }
  if (profile.seller) {
    return {
      fullName: profile.seller.shop_name || "",
      tailoringName: profile.seller.gst_number || "",
      address: profile.seller.shop_address || "",
      phone: profile.seller.phone_number || "",
      eid: profile.seller.eid || "",
      email: profile.seller.email || profile.email || "",
      photoUrl: profile.seller.photo_url || "/default.png",
    };
  }
  return {
    fullName: profile.name || "",
    tailoringName: "",
    address: profile.address || "",
    phone: profile.phone || "",
    eid: "",
    email: profile.email || "",
    photoUrl: profile.photoUrl || "/default.png",
  };
}

function SellerDashboard({ profile, setProfile }) {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    contact: ""
  });
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (!profile) return;
    let sellerId = profile?.seller?.id || profile?.id;
    if (!profile?.seller && sellerId) {
      fetch(`http://localhost:8000/api/sellers/${sellerId}`)
        .then(res => res.json())
        .then(seller => {
          setProfile(prev => ({
            ...prev,
            seller: seller,
          }));
          setDesigns(seller.portfolios || []);
        });
    } else if (profile?.seller && sellerId) {
      fetch(`http://localhost:8000/api/sellers/${sellerId}`)
        .then(res => res.json())
        .then(seller => setDesigns(seller.portfolios || []));
    }
  }, [profile, setProfile]);

  useEffect(() => {
    if (showModal === false && profile?.seller?.id) {
      fetch(`http://localhost:8000/api/sellers/${profile.seller.id}`)
        .then(res => res.json())
        .then(seller => setProfile(prev => ({
          ...prev,
          seller: seller,
        })));
    }
  }, [showModal, profile?.seller?.id, setProfile]);

  const handleLogout = () => {
    setProfile(null);
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!profile) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sellerId = profile?.seller?.id || profile?.id;
    const payload = {
      seller_id: sellerId,
      title: formData.title,
      description: formData.description,
      image_url: formData.imageUrl,
      contact: formData.contact
    };

    try {
      let res, saved;
      if (editingIndex !== null && editingId) {
        res = await fetch(`http://localhost:8000/api/portfolios/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to update design");
        saved = await res.json();
        setDesigns(prev =>
          prev.map((d, idx) => idx === editingIndex ? saved : d)
        );
      } else {
        res = await fetch("http://localhost:8000/api/portfolios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        if (!res.ok) throw new Error("Failed to save design");
        saved = await res.json();
        setDesigns((prev) => [...prev, saved]);
      }
      setFormData({ title: "", description: "", imageUrl: "", contact: "" });
      setEditingIndex(null);
      setEditingId(null);
      window.scrollTo({ top: 0, behavior: "smooth" });
      setTimeout(() => { titleInputRef.current?.focus(); }, 300);
    } catch (err) {
      alert("Design could not be posted: " + err.message);
    }
  };

  const handleEditDesign = (index) => {
    setEditingIndex(index);
    setEditingId(designs[index].id);
    setFormData({
      title: designs[index].title,
      description: designs[index].description,
      imageUrl: designs[index].image_url,
      contact: designs[index].contact,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
    setTimeout(() => { titleInputRef.current?.focus(); }, 300);
  };

  const displayProfile = getDisplayProfile(profile);
  const sellerId = profile?.seller?.id || profile?.id;

  return (
    <div className="flex flex-col items-center p-6">
      {/* Profile top bar */}
      <div className="flex justify-end w-full">
        <img
          src={displayProfile.photoUrl}
          alt="Seller"
          className="rounded-full w-20 h-20 object-cover border-2 border-green-600 cursor-pointer"
          onClick={() => setShowModal(true)}
          title="View Profile"
        />
      </div>

      <ProfileModal
        profile={profile}
        setProfile={setProfile}
        open={showModal}
        onClose={() => { setShowModal(false); setEditProfile(false); }}
        editable={editProfile}
        setEditable={setEditProfile}
        onLogout={handleLogout}
      />

      {/* Go to Chats button - takes seller to seller chat list */}
      {sellerId && (
        <div className="w-full flex justify-end mt-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded shadow transition"
            onClick={() => navigate(`/seller/chats`)}
            title="Go to Chats List"
          >
            Go to Chats
          </button>
        </div>
      )}

      <div className="max-w-xl w-full bg-white/90 rounded-xl shadow-lg p-6 mt-6">
        <h2 className="text-2xl font-bold mb-4 text-green-700">{editingIndex === null ? "Post a New Design" : "Edit Design"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            ref={titleInputRef}
            className="w-full border p-2 rounded"
            type="text"
            name="title"
            placeholder="Design Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
          <textarea
            className="w-full border p-2 rounded"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={formData.imageUrl}
            onChange={handleChange}
            required
          />
          <input
            className="w-full border p-2 rounded"
            type="text"
            name="contact"
            placeholder="Contact Info"
            value={formData.contact}
            onChange={handleChange}
            required
          />
          <div>
            <button
              type="submit"
              className={`px-4 py-2 rounded transition flex items-center justify-center ${
                editingIndex === null
                  ? "bg-green-600 hover:bg-green-700 text-white"
                  : "bg-yellow-600 hover:bg-yellow-700 text-white"
              }`}
            >
              {editingIndex === null ? "Post Design" : "Save Changes"}
            </button>
            {editingIndex !== null && (
              <button
                type="button"
                onClick={() => {
                  setEditingIndex(null);
                  setEditingId(null);
                  setFormData({ title: "", description: "", imageUrl: "", contact: "" });
                }}
                className="ml-4 px-4 py-2 rounded bg-gray-400 hover:bg-gray-500 text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <h3 className="text-xl font-semibold my-6 text-blue-700">Your Designs</h3>
      {designs.length === 0 ? (
        <div className="text-center text-gray-500 my-8 w-full">No designs posted yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
          {designs.map((design, idx) => (
            <div
              key={design.id || idx}
              className="border p-4 rounded shadow bg-white cursor-pointer hover:scale-105 transition"
              onClick={() => handleEditDesign(idx)}
              title="Click to edit"
            >
              <img src={design.image_url} alt="Design" className="w-full h-48 object-cover rounded" />
              <h4 className="text-lg font-bold mt-2">{design.title}</h4>
              <p>{design.description}</p>
              <p className="text-sm text-gray-500 mt-1">Contact: {design.contact}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default SellerDashboard;