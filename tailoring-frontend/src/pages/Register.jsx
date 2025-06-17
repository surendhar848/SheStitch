import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(""); // Phone number state
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [shopName, setShopName] = useState("");
  const [shopAddress, setShopAddress] = useState("");
  const [gstNumber, setGstNumber] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [error, setError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    const payload = {
      email,
      phone_number: phoneNumber,
      password,
      role,
    };
    if (role === "seller") {
      payload.shop_name = shopName;
      payload.shop_address = shopAddress;
      payload.gst_number = gstNumber;
      payload.photo_url = photoUrl;
    }
    try {
      const res = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        alert("Registered! Now login.");
        navigate("/login");
      } else {
        if (data.errors) {
          setError(Object.values(data.errors).flat().join(" "));
        } else {
          setError(data.message || "Registration failed");
        }
      }
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-blue-700">Register</h2>
        <form className="space-y-4" onSubmit={handleRegister} autoComplete="on">
          <input
            id="register-email"
            name="email"
            type="email"
            className="w-full border rounded p-2"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            id="register-phone-number"
            name="phone_number"
            type="tel"
            className="w-full border rounded p-2"
            placeholder="Phone Number"
            value={phoneNumber}
            onChange={e => setPhoneNumber(e.target.value)}
            autoComplete="tel"
          />
          <input
            id="register-password"
            name="password"
            type="password"
            className="w-full border rounded p-2"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <div className="flex gap-4 items-center">
            <label htmlFor="register-customer">
              <input
                id="register-customer"
                name="role"
                type="radio"
                value="customer"
                checked={role === "customer"}
                onChange={() => setRole("customer")}
              />
              Customer
            </label>
            <label htmlFor="register-seller">
              <input
                id="register-seller"
                name="role"
                type="radio"
                value="seller"
                checked={role === "seller"}
                onChange={() => setRole("seller")}
              />
              Seller
            </label>
          </div>
          {role === "seller" && (
            <>
              <input
                id="register-shop-name"
                name="shop_name"
                className="w-full border rounded p-2"
                placeholder="Shop Name"
                value={shopName}
                onChange={e => setShopName(e.target.value)}
                required
                autoComplete="organization"
              />
              <input
                id="register-shop-address"
                name="shop_address"
                className="w-full border rounded p-2"
                placeholder="Shop Address"
                value={shopAddress}
                onChange={e => setShopAddress(e.target.value)}
                autoComplete="street-address"
              />
              <input
                id="register-gst-number"
                name="gst_number"
                className="w-full border rounded p-2"
                placeholder="GST Number"
                value={gstNumber}
                onChange={e => setGstNumber(e.target.value)}
                autoComplete="off"
              />
              <input
                id="register-photo-url"
                name="photo_url"
                className="w-full border rounded p-2"
                placeholder="Photo URL"
                value={photoUrl}
                onChange={e => setPhotoUrl(e.target.value)}
                autoComplete="off"
              />
            </>
          )}
          <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">Register</button>
        </form>
        {error && <div className="mt-2 text-red-600">{error}</div>}
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <button className="text-green-700 underline" type="button" onClick={() => navigate("/login")}>Login</button>
        </div>
      </div>
    </div>
  );
}