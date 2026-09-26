const express = require('express');
const router = express.Router();
const db = require('../db/db');

// Get all books, optionally filter by genre
router.get('/', async (req, res) => {
  try {
    const { genre } = req.query;
    let query = 'SELECT * FROM books';
    let params = [];

    if (genre) {
      query += ' WHERE genre = $1';
      params.push(genre);
    }
    
    query += ' ORDER BY id DESC';

    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Search books by title, author or genre
router.get('/search', async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json([]);
    }

    const searchTerm = `%${query}%`;
    const result = await db.query(
      'SELECT * FROM books WHERE title ILIKE $1 OR author ILIKE $1 OR genre ILIKE $1 ORDER BY id DESC',
      [searchTerm]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// Get single book
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM books WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
