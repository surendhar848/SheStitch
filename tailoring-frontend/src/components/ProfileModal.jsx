import { useRef, useState } from "react";

// Defensive profile display mapper
function getDisplayProfile(profile) {
  if (!profile) {
    return {
      fullName: "",
      tailoringName: "",
      address: "",
      phone: "",
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
      email: profile.seller.email || profile.email || "",
      photoUrl: profile.seller.photo_url || "/default.png",
    };
  }
  // Fallback: just user
  return {
    fullName: profile.name || "",
    tailoringName: "",
    address: profile.address || "",
    phone: profile.phone || "",
    email: profile.email || "",
    photoUrl: profile.photoUrl || "/default.png",
  };
}

export default function ProfileModal({
  profile,
  setProfile,
  open,
  onClose,
  editable,
  setEditable,
  onLogout
}) {
  const fileInput = useRef(null);
  const displayProfile = getDisplayProfile(profile);

  // Local state for editing fields
  const [fields, setFields] = useState(displayProfile);

  // Keep fields in sync with incoming profile
  // (If you open modal for a different user)
  // You can use useEffect if needed.

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setFields((prev) => ({ ...prev, photoUrl: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleFieldChange = (field) => (e) => {
    setFields((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (profile.seller) {
      // Prepare updated seller fields
      const updatedSeller = {
        shop_name: fields.fullName,
        gst_number: fields.tailoringName,
        shop_address: fields.address,
        phone_number: fields.phone,
        email: fields.email,
        photo_url: fields.photoUrl,
      };
      // API call to update seller record
      const res = await fetch(
        `http://localhost:8000/api/sellers/${profile.seller.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedSeller),
        }
      );
      if (res.ok) {
        const sellerData = await res.json();
        setProfile((prev) => ({
          ...prev,
          seller: sellerData,
        }));
        setEditable(false);
      } else {
        alert("Failed to update profile");
      }
    } else {
      // If not seller, just update profile state
      setProfile((prev) => ({
        ...prev,
        name: fields.fullName,
        address: fields.address,
        phone: fields.phone,
        email: fields.email,
        photoUrl: fields.photoUrl,
      }));
      setEditable(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30 transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`bg-white rounded-lg shadow-xl max-w-md w-full p-6 transform transition-all duration-300 ${
          open ? "scale-100" : "scale-95"
        }`}
      >
        <button
          className="absolute top-4 right-7 text-2xl text-gray-400 hover:text-red-500"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col items-center">
          <div
            className="w-28 h-28 rounded-full overflow-hidden border-4 border-green-600 shadow cursor-pointer mb-2 relative group"
            onClick={() => editable && fileInput.current?.click()}
            title={editable ? "Change photo" : ""}
          >
            <img
              src={fields.photoUrl || displayProfile.photoUrl}
              alt="profile"
              className="w-full h-full object-cover"
            />
            {editable && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="bg-white text-xs px-2 py-1 rounded">
                  Change
                </span>
              </div>
            )}
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handlePhotoChange}
          />
          {!editable ? (
            <>
              <h3 className="font-bold text-xl">{displayProfile.fullName}</h3>
              <div className="text-gray-500 mb-2">
                {displayProfile.tailoringName}
              </div>
              <div className="mb-2 text-left w-full">
                <div>
                  <b>Address:</b> {displayProfile.address}
                </div>
                <div>
                  <b>Phone:</b> {displayProfile.phone}
                </div>
                <div>
                  <b>Email:</b> {displayProfile.email}
                </div>
              </div>
              <div className="flex w-full gap-2 mt-2">
                <button
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  onClick={() => {
                    setFields(displayProfile); // reset fields before editing
                    setEditable(true);
                  }}
                >
                  Edit Profile
                </button>
                <button
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <form className="space-y-2 w-full" onSubmit={handleSave}>
              <input
                className="w-full p-2 border rounded"
                value={fields.fullName}
                onChange={handleFieldChange("fullName")}
                placeholder="Shop Name"
              />
              <input
                className="w-full p-2 border rounded"
                value={fields.tailoringName}
                onChange={handleFieldChange("tailoringName")}
                placeholder="GST Number"
              />
              <input
                className="w-full p-2 border rounded"
                value={fields.address}
                onChange={handleFieldChange("address")}
                placeholder="Address"
              />
              <input
                className="w-full p-2 border rounded"
                value={fields.phone}
                onChange={handleFieldChange("phone")}
                placeholder="Phone"
              />
              <input
                className="w-full p-2 border rounded"
                value={fields.email}
                onChange={handleFieldChange("email")}
                placeholder="Email"
              />
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Save
                </button>
                <button
                  type="button"
                  className="flex-1 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                  onClick={() => setEditable(false)}
                >
                  Cancel
                </button>
              </div>
              <div className="flex w-full gap-2 mt-2">
                <div className="flex-1" />
                <button
                  type="button"
                  className="flex-1 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                  onClick={onLogout}
                >
                  Logout
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}