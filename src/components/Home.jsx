import React from 'react'
import { Link } from 'react-router-dom';
import '../styles/style.css'

export default function Home() {
  const categories = [
    { name: "Electronics", image: "/assets/1.png" },
    { name: "Textbooks", image: "/assets/2.png" },
    { name: "Furniture", image: "/assets/3.png" },
    { name: "Accessories", image: "/assets/4.png" },
    { name: "Miscellaneous", image: "/assets/5.png" }
  ];

  return (
    <>
      <header className="hero">
        <div className="hero-overlay">
          <div className="hero-content">
            <h1>Buy. Sell. Trade. Within Your Campus.</h1>
            <p>A trusted marketplace built just for college students.</p>
            <div className="hero-buttons">
              <a href="/browse" className="btn">Browse Listings</a>
              <a href="/post" className="btn secondary">Post Your Item</a>
            </div>
          </div>
        </div>
      </header>

      <section className="features">
        <div className="feature-card">
          <h3>🎓 Campus-only Access</h3>
          <p>Listings visible only to verified college students.</p>
        </div>
        <div className="feature-card">
          <h3>⭐ Peer-Reviewed Sellers</h3>
          <p>Buy from trusted peers with ratings and reviews.</p>
        </div>
        <div className="feature-card">
          <h3>🔒 Safe Meetups</h3>
          <p>Exchange items securely within your campus zone.</p>
        </div>
      </section>

      <section className="shop-by-category">
        <h2 className="shop-heading">🛒 Shop by Category</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <Link 
              key={cat.name} 
              to={`/browse?category=${encodeURIComponent(cat.name)}`} 
              className="category-card"
            >
              <img src={cat.image} alt={cat.name} className="category-img" />
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}
