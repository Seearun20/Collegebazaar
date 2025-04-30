import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function MyListings() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bids, setBids] = useState([]);
  const [bidsLoading, setBidsLoading] = useState(false);
  const [bidsError, setBidsError] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Fetch user's listings
  useEffect(() => {
    const fetchMyListings = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please log in to view your listings');
        }

        const response = await fetch('http://localhost:5000/api/seller/my-listings', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch listings: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setProducts(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message || 'An error occurred while fetching your listings');
      } finally {
        setLoading(false);
      }
    };

    fetchMyListings();
  }, []);

  // Fetch bids for a product
  const fetchBids = async (productId) => {
    try {
      setBidsLoading(true);
      setBidsError(null);
      setSelectedProduct(products.find((p) => p.id === productId));

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to view bids');
      }

      const response = await fetch(`http://localhost:5000/api/bid/all/${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch bids: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched bids:', data.bids.map(bid => ({
        bid_id: bid.bid_id,
        amount: bid.amount,
        bidder_name: bid.bidder_name,
        bidder_email: bid.bidder_email,
        created_at: bid.created_at
      }))); // Structured debug log
      setBids(data.bids || []);
    } catch (err) {
      console.error('Fetch bids error:', err);
      setBidsError(err.message || 'An error occurred while fetching bids');
    } finally {
      setBidsLoading(false);
    }
  };

  // Close modal
  const closeModal = () => {
    setSelectedProduct(null);
    setBids([]);
    setBidsError(null);
  };

  // Handle product deletion
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Please log in to delete a product');
      }

      const response = await fetch(`http://localhost:5000/api/seller/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to delete product: ${response.status} ${response.statusText}`);
      }

      setProducts(products.filter((product) => product.id !== productId));
      alert('Product deleted successfully');
    } catch (err) {
      console.error('Delete error:', err);
      setError(err.message || 'An error occurred while deleting the product');
    }
  };

  return (
    <main className="my-listings-page">
      <h1>My Listings</h1>

      {loading ? (
        <div className="loading">
          <p>Loading your listings...</p>
        </div>
      ) : error ? (
        <div className="error">
          <span className="error-icon">⚠️</span>
          <p>{error}</p>
        </div>
      ) : products.length === 0 ? (
        <div className="no-products">
          <span className="no-products-icon">🚫</span>
          <p>You have no listings. <Link to="/post">Post an item</Link> to get started!</p>
        </div>
      ) : (
        <div className="listing-grid">
          {products.map((item) => (
            <div key={item.id} className="listing-card">
              <div className="image-container">
                <img src={item.image} alt={item.title} />
                <span className="category-badge">{item.category}</span>
              </div>
              <div className="card-content">
                <h2>{item.title}</h2>
                <p className="price">₹{item.price.toLocaleString()}</p>
                <div className="button-group">
                  <button
                    onClick={() => fetchBids(item.id)}
                    className="btn"
                  >
                    Check Biddings
                  </button>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="btn delete-btn"
                  >
                    Remove Product
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for displaying bids */}
      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2>Bids for {selectedProduct.title}</h2>
              <div>
                <button className="btn debug-btn" onClick={() => console.log('Current bids:', bids)}>
                  Debug Bids
                </button>
                <button className="close-btn" onClick={closeModal}>
                  ×
                </button>
              </div>
            </div>
            <div className="modal-content">
              {bidsLoading ? (
                <p>Loading bids...</p>
              ) : bidsError ? (
                <p className="error">{bidsError}</p>
              ) : bids.length === 0 ? (
                <p>No bids yet for this product.</p>
              ) : (
                <table className="bids-table">
                  <thead>
                    <tr>
                      <th>Bid Amount</th>
                      <th>Bidder Name</th>
                      <th>Bidder Email</th>
                      <th>Bid Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bids.map((bid) => (
                      <tr key={bid.bid_id}>
                        <td>₹{bid.amount.toLocaleString()}</td>
                        <td>{bid.bidder_name || 'Unknown'}</td>
                        <td>{bid.bidder_email || 'N/A'}</td>
                        <td>{new Date(bid.created_at).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .my-listings-page {
          max-width: 1200px;
          margin: 40px auto;
          padding: 32px;
          background: linear-gradient(180deg, #ffffff, #f8f9fa);
          border-radius: 16px;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .my-listings-page {
          background: linear-gradient(180deg, #2d2d2d, #252525);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        }

        h1 {
          font-size: 2.5rem;
          font-weight: 800;
          color: #2d2d2d;
          text-align: center;
          margin-bottom: 40px;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
        }

        .dark-mode h1 {
          color: #e0e0e0;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }

        .no-products,
        .loading,
        .error {
          text-align: center;
          padding: 40px;
          background: #f8f9fa;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .dark-mode .no-products,
        .dark-mode .loading,
        .dark-mode .error {
          background: #333;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .no-products-icon,
        .error-icon {
          font-size: 2.5rem;
          display: block;
          margin-bottom: 16px;
        }

        .no-products p,
        .loading p,
        .error p {
          font-size: 1.2rem;
          color: #555;
        }

        .dark-mode .no-products p,
        .dark-mode .loading p,
        .dark-mode .error p {
          color: #ccc;
        }

        .no-products a {
          color: #ff4757;
          text-decoration: none;
          font-weight: 600;
        }

        .no-products a:hover {
          text-decoration: underline;
        }

        .dark-mode .no-products a {
          color: #61dafb;
        }

        .listing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
        }

        .listing-card {
          background: #ffffff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .listing-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
        }

        .dark-mode .listing-card {
          background: #2d2d2d;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }

        .image-container {
          position: relative;
          width: 100%;
          padding-top: 75%; /* 4:3 aspect ratio */
        }

        .image-container img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .category-badge {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #ff4757;
          color: #ffffff;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.9rem;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
        }

        .dark-mode .category-badge {
          background: #61dafb;
          color: #121212;
          box-shadow: 0 2px 8px rgba(97, 218, 251, 0.3);
        }

        .card-content {
          padding: 20px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .card-content h2 {
          font-size: 1.4rem;
          font-weight: 700;
          color: #2d2d2d;
          margin: 0;
        }

        .dark-mode .card-content h2 {
          color: #e0e0e0;
        }

        .price {
          font-size: 1.2rem;
          font-weight: 600;
          color: #ff4757;
          margin: 0;
        }

        .dark-mode .price {
          color: #61dafb;
        }

        .button-group {
          display: flex;
          gap: 12px;
          margin-top: auto;
        }

        .btn {
          flex: 1;
          background: linear-gradient(45deg, #ff4757, #ff6b7b);
          color: #ffffff;
          padding: 12px;
          font-size: 1rem;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(255, 71, 87, 0.3);
          cursor: pointer;
        }

        .btn:hover {
          background: linear-gradient(45deg, #ff2e43, #ff5b6b);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(255, 71, 87, 0.5);
        }

        .delete-btn {
          background: linear-gradient(45deg, #6c757d, #8a939b);
          box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
        }

        .delete-btn:hover {
          background: linear-gradient(45deg, #5c636a, #7a828a);
          box-shadow: 0 4px 12px rgba(108, 117, 125, 0.5);
        }

        .debug-btn {
          background: linear-gradient(45deg, #ffc107, #ffd761);
          margin-right: 8px;
        }

        .debug-btn:hover {
          background: linear-gradient(45deg, #e0a800, #ffca28);
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

        .dark-mode .delete-btn {
          background: linear-gradient(45deg, #6c757d, #8a939b);
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(108, 117, 125, 0.3);
        }

        .dark-mode .delete-btn:hover {
          background: linear-gradient(45deg, #5c636a, #7a828a);
          box-shadow: 0 4px 12px rgba(108, 117, 125, 0.5);
        }

        .dark-mode .debug-btn {
          background: linear-gradient(45deg, #ffc107, #ffd761);
          color: #121212;
        }

        .dark-mode .debug-btn:hover {
          background: linear-gradient(45deg, #e0a800, #ffca28);
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal {
          background: #ffffff;
          border-radius: 12px;
          width: 90%;
          max-width: 800px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
          padding: 24px;
        }

        .dark-mode .modal {
          background: #2d2d2d;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #e0e0e0;
          padding-bottom: 12px;
          margin-bottom: 16px;
        }

        .dark-mode .modal-header {
          border-bottom: 1px solid #444;
        }

        .modal-header h2 {
          font-size: 1.8rem;
          color: #2d2d2d;
          margin: 0;
        }

        .dark-mode .modal-header h2 {
          color: #e0e0e0;
        }

        .modal-header div {
          display: flex;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          color: #555;
          cursor: pointer;
        }

        .dark-mode .close-btn {
          color: #ccc;
        }

        .close-btn:hover {
          color: #ff4757;
        }

        .dark-mode .close-btn:hover {
          color: #61dafb;
        }

        .modal-content {
          padding: 16px 0;
        }

        .modal-content p {
          font-size: 1.1rem;
          color: #555;
          text-align: center;
        }

        .dark-mode .modal-content p {
          color: #ccc;
        }

        .bids-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 16px;
        }

        .bids-table th,
        .bids-table td {
          padding: 12px;
          text-align: left;
          border-bottom: 1px solid #e0e0e0;
          min-width: 120px; /* Increased for email visibility */
        }

        .dark-mode .bids-table th,
        .dark-mode .bids-table td {
          border-bottom: 1px solid #444;
        }

        .bids-table th {
          background: #f8f9fa;
          font-weight: 600;
          color: #2d2d2d;
        }

        .dark-mode .bids-table th {
          background: #333;
          color: #e0e0e0;
        }

        .bids-table td {
          color: #555;
          word-break: break-word; /* Handle long emails */
        }

        .dark-mode .bids-table td {
          color: #ccc;
        }

        .bids-table td:nth-child(3) {
          font-weight: 500; /* Emphasize email column */
        }

        .error {
          color: #ff4757;
          text-align: center;
        }

        .dark-mode .error {
          color: #61dafb;
        }

        @media (max-width: 768px) {
          .my-listings-page {
            margin: 24px 16px;
            padding: 24px;
          }

          h1 {
            font-size: 2rem;
          }

          .listing-grid {
            grid-template-columns: 1fr;
          }

          .button-group {
            flex-direction: column;
            gap: 8px;
          }

          .modal {
            width: 95%;
            padding: 16px;
          }

          .modal-header h2 {
            font-size: 1.5rem;
          }

          .bids-table th,
          .bids-table td {
            padding: 8px;
            font-size: 0.9rem;
            min-width: 80px;
          }
        }

        @media (max-width: 480px) {
          h1 {
            font-size: 1.8rem;
          }

          .card-content h2 {
            font-size: 1.2rem;
          }

          .price {
            font-size: 1.1rem;
          }

          .btn {
            font-size: 0.9rem;
            padding: 10px;
          }

          .modal-header h2 {
            font-size: 1.3rem;
          }

          .bids-table th,
          .bids-table td {
            padding: 6px;
            font-size: 0.8rem;
            min-width: 60px;
          }
        }
      `}</style>
    </main>
  );
}