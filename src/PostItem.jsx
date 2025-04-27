import React, { useState } from 'react';

const PostItem = () => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: ''
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can send `formData` and `images` to backend here
    console.log(formData, images);
    alert('Item posted successfully!');
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-bold mb-4 text-center">📤 Post an Item</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold mb-1">Upload up to 4 Photos</label>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageChange}
            className="w-full"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Item Name / Model</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Asking Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            required
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
          Post Item
        </button>
      </form>
    </div>
  );
};

export default PostItem;
