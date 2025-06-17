import { useState } from "react";
import { useNavigate } from "react-router-dom";

function SellerPostPage({ onPost }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [contact, setContact] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      title,
      description,
      imageUrl,
      contact,
    };
    // You can also save this to backend/localStorage later
    localStorage.setItem("sellerPost", JSON.stringify(newPost));
    alert("Post created successfully!");
    navigate("/seller");
  };

  return (
    <div className="max-w-xl mx-auto mt-8 p-4 border rounded shadow bg-white">
      <h2 className="text-xl font-bold mb-4">Post a New Design</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Design Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <textarea
          placeholder="Design Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Contact Info"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Post Design
        </button>
      </form>
    </div>
  );
}

export default SellerPostPage;
