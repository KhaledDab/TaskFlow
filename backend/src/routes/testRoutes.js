const express = require('express');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// ✅ Route protected
router.get('/private', protect, (req, res) => {
  res.json({
    message: 'You have access ✅',
    user: req.user
  });
});

module.exports = router;
