import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom';
import '../styles/browse.css'

export default function Browse() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const initialCategory = queryParams.get('category') || 'All';

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const listings = [
    { id: 1, title: "HP Laptop", price: 18000, category: "Electronics", image: "/assets/sample1.png" },
    { id: 2, title: "Engineering Mathematics", price: 500, category: "Textbooks", image: "/assets/sample2.png" },
    { id: 3, title: "Study Chair", price: 1500, category: "Furniture", image: "/assets/sample3.png" }
  ];

  const categories = ["All", "Electronics", "Textbooks", "Furniture", "Accessories", "Miscellaneous"];

  const filteredListings = selectedCategory === 'All'
    ? listings
    : listings.filter(item => item.category === selectedCategory);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  return (
    <main className="browse-page">
      <h1>Browse Listings</h1>

      <div className="filter-bar">
        <label htmlFor="category">Filter by Category:</label>
        <select
          id="category"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {filteredListings.length === 0 ? (
        <p className="no-products">🚫 No products available in this category.</p>
      ) : (
        <div className="listing-grid">
          {filteredListings.map((item) => (
            <Link key={item.id} to={`/product?name=${encodeURIComponent(item.title)}`} className="listing-card">
              <img src={item.image} alt={item.title} />
              <h2>{item.title}</h2>
              <p>₹{item.price}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
