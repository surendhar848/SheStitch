import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login({ setProfile }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.user) {
        let fullProfile = { ...data.user };
        if (data.user.role === "seller") {
          const sellerRes = await fetch(`http://localhost:8000/api/sellers/user/${data.user.id}`);
          if (sellerRes.ok) {
            const sellerData = await sellerRes.json();
            fullProfile.seller = sellerData;
          }
          setProfile(fullProfile);
          // Save userId and userProfile in localStorage
          localStorage.setItem("userId", fullProfile.id);
          localStorage.setItem("userProfile", JSON.stringify(fullProfile));
          navigate("/seller");
        } else {
          setProfile(fullProfile);
          // Save userId and userProfile in localStorage
          localStorage.setItem("userId", fullProfile.id);
          localStorage.setItem("userProfile", JSON.stringify(fullProfile));
          navigate("/customer");
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError("Network error");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-green-100">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-green-700">Login</h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            className="w-full border rounded p-2"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            className="w-full border rounded p-2"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">Login</button>
        </form>
        {error && <div className="mt-2 text-red-600">{error}</div>}
        <div className="mt-4 text-center">
          <span>Don't have an account? </span>
          <button className="text-blue-700 underline" onClick={() => navigate("/register")}>Register</button>
        </div>
      </div>
    </div>
  );
}