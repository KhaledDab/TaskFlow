const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const mongoose  = require('mongoose');

const router = express.Router();

// Alive check
router.get('/health', (req, res) => {
  res.status(200).json({ status : "ok"});
});

// Ready check
router.get('/ready', async(req, res) => {
  try{
    if(!mongoose.connection.db){
      return res.status(503).json({ status: "not ready", reason: "no db"});
    }

    await mongoose.connection.db.admin().ping();
    
    return res.status(200).json({ status: "ready"});
  }catch (err){
    return res.status(503).json({ status: "not ready", reason: err.message});
  }
});


// ✅ Route protected
router.get('/private', protect, (req, res) => {
  res.json({
    message: 'You have access ✅',
    user: req.user
  });
});

module.exports = router;
