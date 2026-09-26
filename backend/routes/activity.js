const express = require('express');
const router = express.Router();
const db = require('../db/db');
const auth = require('../middleware/auth');

// Log user activity (VIEW, LIKE, etc)
router.post('/', auth, async (req, res) => {
  try {
    const { book_id, activity_type } = req.body;
    const user_id = req.user.id;

    if (!book_id || !activity_type) {
        return res.status(400).json({ message: 'book_id and activity_type are required' });
    }

    await db.query(
      'INSERT INTO user_activity (user_id, book_id, activity_type) VALUES ($1, $2, $3)',
      [user_id, book_id, activity_type]
    );

    res.status(201).json({ message: 'Activity logged' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Add or update rating
router.post('/rating', auth, async (req, res) => {
  try {
    const { book_id, rating } = req.body;
    const user_id = req.user.id;

    if (!book_id || !rating) {
        return res.status(400).json({ message: 'book_id and rating are required' });
    }

    // Upsert rating
    await db.query(
      `INSERT INTO ratings (user_id, book_id, rating) 
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, book_id) 
       DO UPDATE SET rating = EXCLUDED.rating`,
      [user_id, book_id, rating]
    );

    // Also log it as an activity
    await db.query(
        'INSERT INTO user_activity (user_id, book_id, activity_type) VALUES ($1, $2, $3)',
        [user_id, book_id, 'RATE']
    );

    res.status(201).json({ message: 'Rating saved' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
