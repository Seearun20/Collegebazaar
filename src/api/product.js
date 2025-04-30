// server.js or routes/products.js
const express = require('express');
const router = express.Router();
const pool = require('../db'); // Your PostgreSQL connection pool
const authenticateToken = require('../middleware/auth'); // JWT middleware

// Middleware to verify JWT and extract user_id
router.get('/active-count', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.user_id; // Extracted from JWT
    const query = `
      SELECT COUNT(*) AS count
      FROM products
      WHERE user_id = $1 AND sold = false
    `;
    const result = await pool.query(query, [userId]);
    res.json({ count: parseInt(result.rows[0].count, 10) });
  } catch (err) {
    console.error('Error fetching active listings count:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;