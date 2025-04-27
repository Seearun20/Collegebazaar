import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/ProductPage.css';  

const productsData = {
  "HP Laptop": {
    image: "/assets/sample1.png",
    model: "HP Pavilion 15",
    description: "A powerful laptop with Intel i7, 16GB RAM, 512GB SSD.",
    bid: 18000,
    price: 18000
  },
  "Engineering Mathematics": {
    image: "/assets/sample2.png",
    model: "Version 5",
    description: "Detailed study guide for engineering mathematics.",
    bid: 500,
    price: 500
  },
  "Study Chair": {
    image: "/assets/sample3.png",
    model: "Ergo Chair X1",
    description: "Comfortable ergonomic study chair, perfect for long sessions.",
    bid: 1500,
    price: 1500
  }
};

const ProductPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productName = params.get('name') || 'Unknown Product';
  const product = productsData[productName] || {
    image: "images/default.png",
    model: "N/A",
    description: "No description available.",
    bid: 0,
    price: 0
  };

  const [currentBid, setCurrentBid] = useState(product.bid);
  const [bidAmount, setBidAmount] = useState('');
  const [bidMessage, setBidMessage] = useState('');
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');

  const placeBid = () => {
    const newBid = parseInt(bidAmount);

    if (isNaN(newBid)) {
      setBidMessage("Please enter a valid bid amount.");
      return;
    }

    if (newBid <= currentBid) {
      setBidMessage("Your bid must be higher than the current highest bid.");
      return;
    }

    setCurrentBid(newBid);
    setBidAmount('');
    setBidMessage("Bid placed successfully! You are the highest bidder.");
  };

  const postComment = () => {
    if (commentInput.trim() === "") {
      alert("Please write something before posting.");
      return;
    }
    setComments([...comments, commentInput.trim()]);
    setCommentInput('');
  };

  const editComment = (index) => {
    const newComment = prompt("Edit your comment:", comments[index]);
    if (newComment !== null) {
      const updatedComments = [...comments];
      updatedComments[index] = newComment.trim();
      setComments(updatedComments);
    }
  };

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">CollegeBazaar</div>
        <ul className="nav-links">
          <li><a href="/">Home</a></li>
          <li><a href="#">Categories</a></li>
          <li><a href="#">About</a></li>
        </ul>
      </nav>

      {/* Main Container */}
      <div className="product-page-container">
        
        {/* Product Details */}
        <section className="product-container">
          <div className="product-image">
            <img src={product.image} alt={productName} />
          </div>
          <div className="product-details">
            <h1>{productName}</h1>
            <p><span>Model:</span> {product.model}</p>
            <p><span>Description:</span> {product.description}</p>
            <p><span>Current Highest Bid:</span> ₹{currentBid}</p>
            <p><span>Asking Price:</span> ₹{product.price}</p>
          </div>
        </section>

        {/* Bidding Section */}
        <section className="bidding-container">
          <h2>Place Your Bid</h2>
          <p>Current Highest Bid: ₹{currentBid}</p>

          <div className="bidding-actions">
            <input
              type="number"
              placeholder="Enter your bid"
              min="0"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
            />
            <button onClick={placeBid}>Place Bid</button>
          </div>

          {bidMessage && (
            <p id="bidMessage" style={{ color: bidMessage.includes('successfully') ? 'green' : 'red' }}>
              {bidMessage}
            </p>
          )}
        </section>

        {/* Comments Section */}
        <section className="comments-container">
          <h2>Post Your Query / Comment</h2>

          <div className="comment-actions">
            <textarea
              placeholder="Type your query or comment here..."
              value={commentInput}
              onChange={(e) => setCommentInput(e.target.value)}
            ></textarea>
            <button onClick={postComment}>Post Comment</button>
          </div>

          <div id="commentsList">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <p>{comment}</p>
                <button onClick={() => editComment(index)}>Edit</button>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-column">
            <h3>About</h3>
            <ul>
              <li><a href="#">Our Story</a></li>
              <li><a href="#">Team</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="#">FAQs</a></li>
              <li><a href="#">Contact Us</a></li>
            </ul>
          </div>
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2025 CollegeBazaar. All rights reserved.</span>
          <div className="footer-links">
            <a href="#">Facebook</a> |
            <a href="#">Instagram</a> |
            <a href="#">Twitter</a>
          </div>
        </div>
      </footer>
    </>
  );
};

export default ProductPage;
