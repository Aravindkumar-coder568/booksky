const express = require('express');
const router = express.Router();
const { spawn } = require('child_process');
const path = require('path');
const db = require('../db/db');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const user_id = req.user.id;

    // 1. Get user's liked or highly rated books as preference signals
    const activityResult = await db.query(
      `SELECT DISTINCT book_id FROM user_activity 
       WHERE user_id = $1 AND activity_type IN ('LIKE', 'RATE') 
       ORDER BY book_id DESC LIMIT 5`,
      [user_id]
    );

    let targetBookIds = activityResult.rows.map(row => row.book_id);

    // If no explicit likes/rates, fall back to viewed books
    if (targetBookIds.length === 0) {
      const viewsResult = await db.query(
        `SELECT DISTINCT book_id FROM user_activity 
         WHERE user_id = $1 AND activity_type = 'VIEW'
         ORDER BY book_id DESC LIMIT 5`,
        [user_id]
      );
      targetBookIds = viewsResult.rows.map(row => row.book_id);
    }

    // 2. If STILL no activity, return popular/featured books
    if (targetBookIds.length === 0) {
      const popular = await db.query('SELECT * FROM books ORDER BY rating DESC NULLS LAST LIMIT 5');
      return res.json({
        type: 'popular',
        message: 'Explore books to get personalized recommendations.',
        books: popular.rows
      });
    }

    // 3. We have some book IDs. Call the Python ML script.
    // We'll pass the first target book ID to the script for simplicity,
    // or we can pass multiple. Let's pass the most recently interacted one.
    const mainTargetId = targetBookIds[0];

    const pythonScriptPath = path.join(__dirname, '../../ml/recommend.py');
    
    // We also need to fetch ALL books to pass to Python (or Python can fetch from DB itself).
    // To keep Python simple and decoupled from DB credentials, let's have Python read a JSON file 
    // or we can pass data via stdin. 
    // Wait, the easiest beginner-friendly way: 
    // Let Python connect to DB itself? No, we don't want to duplicate env vars.
    // Let Node.js dump books to a temporary JSON or CSV, or pass via stdout.
    // Let's have Node.js write books to ml/books.csv first if it doesn't exist, OR 
    // we just fetch all books, and pass them as a JSON string to the python script via stdin.
    
    const allBooksResult = await db.query('SELECT id, title, author, genre, description FROM books');
    const allBooks = allBooksResult.rows;

    const pythonProcess = spawn('python', [pythonScriptPath, mainTargetId]);

    let outputData = '';
    let errorData = '';

    // Pass the books JSON to Python via stdin
    pythonProcess.stdin.write(JSON.stringify(allBooks));
    pythonProcess.stdin.end();

    pythonProcess.stdout.on('data', (data) => {
      outputData += data.toString();
    });

    pythonProcess.stderr.on('data', (data) => {
      errorData += data.toString();
    });

    pythonProcess.on('close', async (code) => {
      if (code !== 0) {
        console.error('Python script error:', errorData);
        return res.status(500).json({ message: 'Error generating recommendations' });
      }

      try {
        const recommendationIds = JSON.parse(outputData);
        
        // 4. Fetch the full book details from PostgreSQL
        if (recommendationIds.length === 0) {
            return res.json({ type: 'personalized', message: 'No recommendations found.', books: [] });
        }

        const placeholders = recommendationIds.map((_, i) => '$' + (i + 1)).join(',');
        const recommendedBooksResult = await db.query(
          `SELECT * FROM books WHERE id IN (${placeholders})`,
          recommendationIds
        );

        // Sort them to match the ML output order
        const sortedBooks = recommendationIds.map(id => 
          recommendedBooksResult.rows.find(b => b.id === id)
        ).filter(Boolean);

        // Fetch the target book name to give a human-friendly message
        const targetBookResult = await db.query('SELECT title FROM books WHERE id = $1', [mainTargetId]);
        const targetTitle = targetBookResult.rows.length > 0 ? targetBookResult.rows[0].title : 'your recent activity';

        res.json({
          type: 'personalized',
          message: `Because you interacted with "${targetTitle}"`,
          books: sortedBooks
        });

      } catch (parseErr) {
        console.error('Failed to parse Python output:', parseErr, outputData);
        res.status(500).json({ message: 'Error parsing recommendations' });
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
