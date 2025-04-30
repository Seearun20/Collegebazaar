import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const styles = `
  .product-page { max-width: 1000px; margin: 40px auto; padding: 32px; background: linear-gradient(180deg, #ffffff, #f8f9fa); border-radius: 16px; box-shadow: 0 6px 16px rgba(0,0,0,0.1); }
  .dark-mode .product-page { background: linear-gradient(180deg, #2d2d2d, #252525); box-shadow: 0 6px 16px rgba(0,0,0,0.3); }
  .product-page-container { display: grid; gap: 32px; }
  .product-container { display: flex; gap: 32px; background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .dark-mode .product-container { background: #2d2d2d; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .product-image { flex: 1; max-width: 400px; }
  .product-image img { width: 100%; height: auto; border-radius: 12px; object-fit: cover; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .product-details { flex: 1; display: flex; flex-direction: column; gap: 16px; }
  .product-details h1 { font-size: 2rem; font-weight: 800; color: #2d2d2d; margin: 0; }
  .dark-mode .product-details h1 { color: #e0e0e0; }
  .product-details p { font-size: 1.1rem; color: #555; margin: 0; }
  .dark-mode .product-details p { color: #ccc; }
  .product-details p span { font-weight: 600; color: #2d2d2d; }
  .dark-mode .product-details p span { color: #e0e0e0; }
  .bidding-container, .comments-container { background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); }
  .dark-mode .bidding-container, .dark-mode .comments-container { background: #2d2d2d; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  .bidding-container h2, .comments-container h2 { font-size: 1.8rem; font-weight: 700; color: #2d2d2d; margin-bottom: 16px; }
  .dark-mode .bidding-container h2, .dark-mode .comments-container h2 { color: #e0e0e0; }
  .bidding-container > p { font-size: 1.1rem; color: #555; margin-bottom: 16px; }
  .dark-mode .bidding-container > p { color: #ccc; }
  .bidding-actions { display: flex; gap: 16px; align-items: center; }
  input, textarea { padding: 12px; font-size: 1rem; border: 1px solid #ddd; border-radius: 8px; background: #f8f9fa; color: #2d2d2d; width: 100%; transition: border-color 0.3s, box-shadow 0.3s; }
  .dark-mode input, .dark-mode textarea { border-color: #555; background: #333; color: #e0e0e0; }
  input:focus, textarea:focus { outline: none; border-color: #ff4757; box-shadow: 0 0 8px rgba(255,71,87,0.3); }
  .dark-mode input:focus, .dark-mode textarea:focus { border-color: #61dafb; box-shadow: 0 0 8px rgba(97,218,251,0.3); }
  .error { border-color: #e41e3f !important; }
  .error-message { color: #e41e3f; font-size: 0.9rem; margin-top: 8px; }
  .success-message { color: #43a047; font-size: 0.9rem; margin-top: 8px; }
  .comment-actions { display: flex; flex-direction: column; gap: 16px; }
  textarea { resize: vertical; min-height: 100px; }
  .comments-list { margin-top: 24px; display: flex; flex-direction: column; gap: 16px; }
  .no-comments { font-size: 1.1rem; color: #555; text-align: center; padding: 16px; background: #f8f9fa; border-radius: 8px; }
  .dark-mode .no-comments { color: #ccc; background: #333; }
  .comment { background: #f8f9fa; border-radius: 8px; padding: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
  .dark-mode .comment { background: #333; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }
  .comment p { font-size: 1rem; color: #2d2d2d; margin: 0 0 12px; }
  .dark-mode .comment p { color: #e0e0e0; }
  .comment .comment-actions { display: flex; gap: 12px; justify-content: flex-end; }
  .btn { background: linear-gradient(45deg, #ff4757, #ff6b7b); color: #ffffff; padding: 12px 24px; font-size: 1rem; font-weight: 600; border: none; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; box-shadow: 0 2px 8px rgba(255,71,87,0.3); }
  .btn:hover { background: linear-gradient(45deg, #ff2e43, #ff5b6b); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(255,71,87,0.5); }
  .btn.secondary { background: linear-gradient(45deg, #e3f2fd, #bbdefb); color: #1e88e5; box-shadow: 0 2px 8px rgba(30,136,229,0.3); }
  .btn.secondary:hover { background: linear-gradient(45deg, #bbdefb, #90caf9); transform: translateY(-2px); box-shadow: 0 4px 12px rgba(30,136,229,0.5); }
  .btn.secondary.small { padding: 8px 16px; font-size: 0.9rem; }
  .dark-mode .btn { background: linear-gradient(45deg, #61dafb, #7be6ff); color: #121212; box-shadow: 0 2px 8px rgba(97,218,251,0.3); }
  .dark-mode .btn:hover { background: linear-gradient(45deg, #4ccaf9, #69d6ff); box-shadow: 0 4px 12px rgba(97,218,251,0.5); }
  .dark-mode .btn.secondary { background: linear-gradient(45deg, #2a2a2a, #3a3a3a); color: #e0e0e0; box-shadow: 0 2px 8px rgba(255,255,255,0.2); }
  .dark-mode .btn.secondary:hover { background: linear-gradient(45deg, #3a3a3a, #4a4a4a); box-shadow: 0 4px 12px rgba(255,255,255,0.3); }
  .loading, .error { text-align: center; padding: 40px; background: #f8f9fa; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); margin: 20px; }
  .dark-mode .loading, .dark-mode .error { background: #333; box-shadow: 0 4px 12px rgba(0,0,0,0.3); }
  @media (max-width: 768px) { .product-page { margin: 24px 16px; padding: 24px; } .product-container { flex-direction: column; gap: 24px; } .product-image { max-width: 100%; } .product-details h1 { font-size: 1.8rem; } .bidding-container h2, .comments-container h2 { font-size: 1.6rem; } .bidding-actions { flex-direction: column; gap: 12px; } .btn { width: 100%; } }
  @media (max-width: 480px) { .product-details h1 { font-size: 1.6rem; } .product-details p { font-size: 1rem; } .bidding-container h2, .comments-container h2 { font-size: 1.4rem; } input, textarea { font-size: 0.9rem; } .btn { font-size: 0.9rem; padding: 10px; } }
`;

const ProductPage = () => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const productName = params.get('name') || 'Unknown Product';

  const [product, setProduct] = useState({
    id: null,
    title: productName,
    description: 'Loading...',
    price: 0,
    image: '/assets/default.png',
  });
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState('');
  const [bidError, setBidError] = useState('');
  const [bidSuccess, setBidSuccess] = useState('');
  const [bidLoading, setBidLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [commentError, setCommentError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProductAndQueries = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch product details
        const productResponse = await fetch('http://localhost:5000/api/seller', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (!productResponse.ok) {
          throw new Error(`Failed to fetch products: ${productResponse.status}`);
        }

        const products = await productResponse.json();
        const foundProduct = products.find((p) => p.title === productName);
        if (!foundProduct) {
          throw new Error(`Product "${productName}" not found`);
        }

        setProduct({
          id: foundProduct.id,
          title: foundProduct.title,
          description: foundProduct.description || 'No description available.',
          price: foundProduct.price || 0,
          image: foundProduct.image || '/assets/default.png',
        });

        // Fetch the highest bid
        const highestBidResponse = await fetch(`http://localhost:5000/api/bid/highest/${foundProduct.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });

        if (highestBidResponse.ok) {
          const highestBidData = await highestBidResponse.json();
          setCurrentBid(highestBidData.highest_bid.amount || foundProduct.price);
        } else if (highestBidResponse.status === 404) {
          setCurrentBid(foundProduct.price || 0);
        } else {
          throw new Error('Failed to fetch highest bid');
        }

        // Fetch queries/comments
        if (foundProduct.id) {
          const queryResponse = await fetch(`http://localhost:5000/api/queries/product/${foundProduct.id}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
            },
          });

          if (!queryResponse.ok) {
            if (queryResponse.status === 404) {
              setComments([]);
            } else {
              throw new Error(`Failed to fetch queries: ${queryResponse.status}`);
            }
          } else {
            const queryData = await queryResponse.json();
            setComments(queryData.queries || []);
          }
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndQueries();
  }, [productName]);

  const placeBid = async () => {
    setBidLoading(true);
    setBidError('');
    setBidSuccess('');

    const newBid = parseFloat(bidAmount);
    if (isNaN(newBid) || newBid <= 0) {
      setBidError('Please enter a valid bid amount.');
      setBidLoading(false);
      return;
    }

    if (newBid <= currentBid) {
      setBidError(`Bid must be greater than current highest bid (₹${currentBid.toLocaleString()}).`);
      setBidLoading(false);
      return;
    }

    try {
      const bidResponse = await fetch(`http://localhost:5000/api/bid/${product.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ amount: newBid }),
      });

      const bidData = await bidResponse.json();
      if (!bidResponse.ok) {
        throw new Error(bidData.error || 'Failed to place bid');
      }

      // Fetch updated highest bid
      const highestBidResponse = await fetch(`http://localhost:5000/api/bid/highest/${product.id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
      });

      if (highestBidResponse.ok) {
        const highestBidData = await highestBidResponse.json();
        setCurrentBid(highestBidData.highest_bid.amount);
      }

      setBidAmount('');
      setBidSuccess('Bid placed successfully!');
    } catch (err) {
      console.error('Place bid error:', err);
      setBidError(err.message || 'Failed to place bid. Please try again.');
    } finally {
      setBidLoading(false);
    }
  };

  const postComment = async () => {
    if (commentInput.trim() === '') {
      setCommentError('Please write something before posting.');
      return;
    }
    if (!product.id) {
      setCommentError('Product ID not available.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/queries/${product.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
        },
        body: JSON.stringify({ query: commentInput.trim() }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to post query: ${response.status}`);
      }

      const data = await response.json();
      setComments([...comments, {
        query_id: data.query.query_id,
        text: data.query.query,
        customer_name: data.query.customer_name || 'Anonymous',
      }]);
      setCommentInput('');
      setCommentError('');
    } catch (err) {
      console.error('Post comment error:', err);
      setCommentError(err.message || 'Failed to post query. Please try again.');
    }
  };

  const editComment = async (index) => {
    const comment = comments[index];
    const newComment = prompt('Edit your query:', comment.text);
    if (newComment && newComment.trim()) {
      try {
        const response = await fetch(`http://localhost:5000/api/queries/${comment.query_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
          body: JSON.stringify({ query: newComment.trim() }),
        });
        if (!response.ok) throw new Error('Failed to update');
        const data = await response.json();
        const updatedComments = [...comments];
        updatedComments[index] = { ...comment, text: data.query.query, query: data.query.query };
        setComments(updatedComments);
      } catch (err) {
        console.error('Edit comment error:', err);
        alert('Failed to update query.');
      }
    }
  };

  const deleteComment = async (index) => {
    if (window.confirm('Are you sure?')) {
      const comment = comments[index];
      try {
        const response = await fetch(`http://localhost:5000/api/queries/${comment.query_id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token') || ''}`,
          },
        });
        if (!response.ok) throw new Error('Failed to delete');
        setComments(comments.filter((_, i) => i !== index));
      } catch (err) {
        console.error('Delete comment error:', err);
        alert('Failed to delete query.');
      }
    }
  };

  if (loading) return (
    <main className="product-page">
      <div className="loading">Loading...</div>
      <style>{styles}</style>
    </main>
  );
  if (error) return (
    <main className="product-page">
      <div className="error">Error: {error}</div>
      <style>{styles}</style>
    </main>
  );

  return (
    <main className="product-page">
      <div className="product-page-container">
        <section className="product-container">
          <div className="product-image">
            <img src={product.image} alt={product.title} />
          </div>
          <div className="product-details">
            <h1>{product.title}</h1>
            <p><span>Model:</span> N/A</p>
            <p><span>Description:</span> {product.description}</p>
            <p><span>Current Highest Bid:</span> ₹{currentBid.toLocaleString()}</p>
            <p><span>Asking Price:</span> ₹{product.price.toLocaleString()}</p>
          </div>
        </section>
        <section className="bidding-container">
          <h2>Place Your Bid</h2>
          <p>Current Highest Bid: ₹{currentBid.toLocaleString()}</p>
          <div className="bidding-actions">
            <input
              type="number"
              placeholder="Enter your bid (₹)"
              min="0"
              step="0.01"
              value={bidAmount}
              onChange={(e) => { setBidAmount(e.target.value); setBidError(''); setBidSuccess(''); }}
              className={bidError ? 'error' : ''}
              disabled={bidLoading}
            />
            <button className="btn" onClick={placeBid} disabled={bidLoading}>
              {bidLoading ? 'Placing Bid...' : 'Place Bid'}
            </button>
          </div>
          {bidError && <p className="error-message">{bidError}</p>}
          {bidSuccess && <p className="success-message">{bidSuccess}</p>}
        </section>
        <section className="comments-container">
          <h2>Post Your Query / Comment</h2>
          <div className="comment-actions">
            <textarea
              placeholder="Type your query or comment..."
              value={commentInput}
              onChange={(e) => { setCommentInput(e.target.value); setCommentError(''); }}
              rows="4"
              className={commentError ? 'error' : ''}
            />
            <button className="btn" onClick={postComment}>Post Query</button>
          </div>
          {commentError && <p className="error-message">{commentError}</p>}
          <div className="comments-list">
            {comments.length === 0 ? <p className="no-comments">No queries yet.</p> : comments.map((comment, index) => (
              <div key={comment.query_id || index} className="comment">
                <p><strong>{comment.customer_name}:</strong> {comment.text}</p>
                <div className="comment-actions">
                  <button className="btn secondary small" onClick={() => editComment(index)}>Edit</button>
                  <button className="btn secondary small" onClick={() => deleteComment(index)}>Delete</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      <style>{styles}</style>
    </main>
  );
};

export default ProductPage;