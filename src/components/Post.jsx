import React, { useState } from 'react';
import axios from 'axios';

export default function Post() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    asking_price: '',
    deadline: '',
    category: ''
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const categories = [
    'Electronics',
    'Textbooks',
    'Furniture',
    'Accessories',
    'Miscellaneous'
  ];

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    // Clear error when user types
    setErrors(prev => ({ ...prev, [e.target.name]: '' }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files).slice(0, 4);
    setImages(files);
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Item name is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.asking_price || formData.asking_price <= 0) newErrors.asking_price = 'Valid price is required';
    if (!formData.deadline) newErrors.deadline = 'Deadline is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to post a product.');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Post the product data
      const productRes = await axios.post(
        'http://localhost:5000/api/seller/add-product',
        {
          name: formData.name,
          description: formData.description,
          asking_price: parseFloat(formData.asking_price),
          deadline: new Date(formData.deadline).toISOString(),
          category: formData.category
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const product_id = productRes.data.product.product_id;

      // Step 2: Upload images
      if (images.length > 0) {
        const imgForm = new FormData();
        images.forEach(img => imgForm.append('images', img));

        await axios.post(
          `http://localhost:5000/api/images/${product_id}`,
          imgForm,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'multipart/form-data'
            }
          }
        );
      }

      alert('Product posted successfully!');
      setFormData({ name: '', description: '', asking_price: '', deadline: '', category: '' });
      setImages([]);
      setErrors({});
    } catch (error) {
      console.error('Error posting product:', error);
      alert('Failed to post product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="post-page">
      <h1>Post Your Item</h1>
      <form className="post-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Item Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={errors.name ? 'error' : ''}
            required
          />
          {errors.name && <span className="error-message">{errors.name}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={errors.category ? 'error' : ''}
            required
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          {errors.category && <span className="error-message">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className={errors.description ? 'error' : ''}
            required
          ></textarea>
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="asking_price">Asking Price (₹)</label>
          <input
            type="number"
            id="asking_price"
            name="asking_price"
            value={formData.asking_price}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={errors.asking_price ? 'error' : ''}
            required
          />
          {errors.asking_price && <span className="error-message">{errors.asking_price}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="deadline">Deadline to Sell</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className={errors.deadline ? 'error' : ''}
            required
          />
          {errors.deadline && <span className="error-message">{errors.deadline}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="images">Upload Images (up to 4)</label>
          <input
            type="file"
            id="images"
            name="images"
            accept="image/*"
            onChange={handleImageChange}
            multiple
          />
          {images.length > 0 && (
            <div className="image-preview">
              {images.map((img, index) => (
                <img
                  key={index}
                  src={URL.createObjectURL(img)}
                  alt={`Preview ${index + 1}`}
                  className="preview-img"
                />
              ))}
            </div>
          )}
        </div>

        <button type="submit" className="btn" disabled={loading}>
          {loading ? (
            <span className="spinner"></span>
          ) : (
            'Post Listing'
          )}
        </button>
      </form>

      <style jsx="true">{`
        .post-page {
          max-width: 800px;
          margin: 40px auto;
          padding: 24px;
          background: linear-gradient(180deg, #ffffff, #f8f9fa);
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .dark-mode .post-page {
          background: linear-gradient(180deg, #2d2d2d, #252525);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d2d2d;
          text-align: center;
          margin-bottom: 32px;
        }
        
        .dark-mode h1 {
          color: #e0e0e0;
        }
        
        .post-form {
          display: grid;
          gap: 24px;
        }
        
        .form-group {
          display: flex;
          flex-direction: column;
        }
        
        label {
          font-size: 1.1rem;
          font-weight: 600;
          color: #2d2d2d;
          margin-bottom: 8px;
        }
        
        .dark-mode label {
          color: #e0e0e0;
        }
        
        input, textarea, select {
          padding: 12px;
          font-size: 1rem;
          border: 1px solid #ddd;
          border-radius: 8px;
          background: #f8f9fa;
          color: #2d2d2d;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        
        .dark-mode input,
        .dark-mode textarea,
        .dark-mode select {
          border-color: #555;
          background: #333;
          color: #e0e0e0;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #ff4757;
          box-shadow: 0 0 8px rgba(255, 71, 87, 0.3);
        }
        
        .dark-mode input:focus,
        .dark-mode textarea:focus,
        .dark-mode select:focus {
          border-color: #61dafb;
          box-shadow: 0 0 8px rgba(97, 218, 251, 0.3);
        }
        
        textarea {
          resize: vertical;
        }
        
        .error {
          border-color: #e41e3f !important;
        }
        
        .error-message {
          color: #e41e3f;
          font-size: 0.9rem;
          margin-top: 4px;
        }
        
        .image-preview {
          display: flex;
          gap: 16px;
          flex-wrap: wrap;
          margin-top: 12px;
        }
        
        .preview-img {
          width: 100px;
          height: 100px;
          object-fit: cover;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }
        
        .btn {
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
          color: #ffffff;
          padding: 14px;
          font-size: 1.1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
        }
        
        .btn:hover {
          background: linear-gradient(45deg, #ff2e43, #ff5b6b);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 71, 87, 0.5);
        }
        
        .btn:disabled {
          background: #ccc;
          cursor: not-allowed;
          transform: none;
          box-shadow: none;
        }
        
        .dark-mode .btn {
          background: linear-gradient(45deg, #61dafb, #7be6ff);
          color: #121212;
          box-shadow: 0 2px 8px rgba(97, 218, 251, 0.3);
        }
        
        .dark-mode .btn:hover {
          background: linear-gradient(45deg, #4ccaf9, #69d6ff);
          box-shadow: 0 4px 12px rgba(97, 218, 251, 0.5);
        }
        
        .dark-mode .btn:disabled {
          background: #555;
          color: #888;
        }
        
        .spinner {
          width: 24px;
          height: 24px;
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spin 1s ease-in-out infinite;
        }
        
        .dark-mode .spinner {
          border-color: rgba(0, 0, 0, 0.3);
          border-top-color: #121212;
        }
        
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .post-page {
            margin: 24px 16px;
            padding: 16px;
          }
          
          h1 {
            font-size: 2rem;
          }
          
          .post-form {
            gap: 16px;
          }
          
          .preview-img {
            width: 80px;
            height: 80px;
          }
        }
        
        @media (max-width: 480px) {
          h1 {
            font-size: 1.8rem;
          }
          
          label {
            font-size: 1rem;
          }
          
          input, textarea, select {
            font-size: 0.9rem;
          }
          
          .btn {
            font-size: 1rem;
            padding: 12px;
          }
        }
      `}</style>
    </main>
  );
}