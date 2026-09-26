const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

const sampleBooks = [
  {
    title: 'Harry Potter and the Sorcerer\'s Stone',
    author: 'J.K. Rowling',
    genre: 'Fantasy',
    description: 'A young boy discovers he is a wizard and attends a magical school.',
    rating: 4.8,
    cover_image: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=400&q=80'
  },
  {
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    genre: 'Fantasy',
    description: 'A fantasy adventure about Bilbo Baggins and his journey to the Lonely Mountain.',
    rating: 4.9,
    cover_image: 'https://images.unsplash.com/photo-1606191028014-996be4b2ea67?w=400&q=80'
  },
  {
    title: 'Percy Jackson and the Lightning Thief',
    author: 'Rick Riordan',
    genre: 'Fantasy',
    description: 'A teenager discovers he is a demigod and must prevent a war among the gods.',
    rating: 4.6,
    cover_image: 'https://images.unsplash.com/photo-1598301257982-0cf014dabbcd?w=400&q=80'
  },
  {
    title: 'The Chronicles of Narnia',
    author: 'C.S. Lewis',
    genre: 'Fantasy',
    description: 'Children discover a magical wardrobe that leads to the land of Narnia.',
    rating: 4.7,
    cover_image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80'
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Science Fiction',
    description: 'A young nobleman becomes involved in a political and environmental struggle on a desert planet.',
    rating: 4.8,
    cover_image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&q=80'
  },
  {
    title: 'Ender\'s Game',
    author: 'Orson Scott Card',
    genre: 'Science Fiction',
    description: 'A gifted child is recruited to a military academy in space to prepare for an alien invasion.',
    rating: 4.5,
    cover_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&q=80'
  },
  {
    title: 'The Martian',
    author: 'Andy Weir',
    genre: 'Science Fiction',
    description: 'An astronaut is stranded on Mars and must use his scientific knowledge to survive.',
    rating: 4.7,
    cover_image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=400&q=80'
  },
  {
    title: 'Pride and Prejudice',
    author: 'Jane Austen',
    genre: 'Romance',
    description: 'A classic story of love, class, and misunderstandings in 19th century England.',
    rating: 4.6,
    cover_image: 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=400&q=80'
  },
  {
    title: 'The Notebook',
    author: 'Nicholas Sparks',
    genre: 'Romance',
    description: 'A modern romantic tale about an enduring love that survives decades.',
    rating: 4.3,
    cover_image: 'https://images.unsplash.com/photo-1474552226712-ac0f0961a954?w=400&q=80'
  },
  {
    title: 'The Girl with the Dragon Tattoo',
    author: 'Stieg Larsson',
    genre: 'Mystery',
    description: 'A journalist and a computer hacker investigate a decades-old disappearance.',
    rating: 4.4,
    cover_image: 'https://images.unsplash.com/photo-1587876800732-2d1421eb1a82?w=400&q=80'
  },
  {
    title: 'Gone Girl',
    author: 'Gillian Flynn',
    genre: 'Mystery',
    description: 'A suspenseful thriller about a marriage gone terribly wrong and a missing wife.',
    rating: 4.5,
    cover_image: 'https://images.unsplash.com/photo-1605369572399-05d8d64a0f6e?w=400&q=80'
  },
  {
    title: 'Sherlock Holmes: The Complete Novels',
    author: 'Arthur Conan Doyle',
    genre: 'Mystery',
    description: 'The classic detective uses logical reasoning to solve complex mysteries.',
    rating: 4.8,
    cover_image: 'https://images.unsplash.com/photo-1626618012641-bfbca5a31239?w=400&q=80'
  },
  {
    title: 'Steve Jobs',
    author: 'Walter Isaacson',
    genre: 'Biography',
    description: 'The biography of the visionary Apple co-founder who revolutionized technology.',
    rating: 4.6,
    cover_image: 'https://images.unsplash.com/photo-1509395176047-4a66953fd231?w=400&q=80'
  },
  {
    title: 'The Diary of a Young Girl',
    author: 'Anne Frank',
    genre: 'Biography',
    description: 'The inspiring and tragic diary of a Jewish girl hiding during World War II.',
    rating: 4.8,
    cover_image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&q=80'
  },
  {
    title: 'Clean Code',
    author: 'Robert C. Martin',
    genre: 'Technology',
    description: 'A handbook of agile software craftsmanship for writing better, readable code.',
    rating: 4.7,
    cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80'
  },
  {
    title: 'The Pragmatic Programmer',
    author: 'Andrew Hunt',
    genre: 'Technology',
    description: 'Practical advice and best practices for software developers.',
    rating: 4.8,
    cover_image: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&q=80'
  },
  {
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    genre: 'History',
    description: 'A profound look at the history and evolution of the human species.',
    rating: 4.7,
    cover_image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=400&q=80'
  },
  {
    title: 'Guns, Germs, and Steel',
    author: 'Jared Diamond',
    genre: 'History',
    description: 'An exploration of how geography and environment shaped human societies.',
    rating: 4.5,
    cover_image: 'https://images.unsplash.com/photo-1447015237013-0e80b2786dea?w=400&q=80'
  },
  {
    title: 'Into the Wild',
    author: 'Jon Krakauer',
    genre: 'Adventure',
    description: 'The true story of a young man who leaves society to survive in the Alaskan wilderness.',
    rating: 4.4,
    cover_image: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?w=400&q=80'
  },
  {
    title: 'Life of Pi',
    author: 'Yann Martel',
    genre: 'Adventure',
    description: 'A boy survives a shipwreck and shares a lifeboat with a Bengal tiger.',
    rating: 4.3,
    cover_image: 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=400&q=80'
  }
];

async function seedDatabase() {
  try {
    console.log('Reading init.sql...');
    const initSql = fs.readFileSync(path.join(__dirname, 'init.sql'), 'utf8');
    
    console.log('Executing init.sql to create tables...');
    await pool.query(initSql);
    console.log('Tables created successfully.');

    // Clear existing books to avoid duplicates if run multiple times
    console.log('Clearing old book data...');
    await pool.query('DELETE FROM books');

    console.log('Inserting sample books...');
    for (const book of sampleBooks) {
      await pool.query(
        'INSERT INTO books (title, author, genre, description, rating, cover_image) VALUES ($1, $2, $3, $4, $5, $6)',
        [book.title, book.author, book.genre, book.description, book.rating, book.cover_image]
      );
    }
    console.log('Database seeded successfully with 20 books!');

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    pool.end();
  }
}

seedDatabase();
