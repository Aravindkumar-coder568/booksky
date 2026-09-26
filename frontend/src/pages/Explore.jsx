import { useState, useEffect } from 'react';
import { getBooks, searchBooks } from '../services/api';
import BookCard from '../components/BookCard';

function Explore() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('');

  const genres = ['Fantasy', 'Science Fiction', 'Romance', 'Mystery', 'Biography', 'Technology', 'History', 'Adventure'];

  useEffect(() => {
    fetchBooks();
  }, [genre]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      const res = await getBooks(genre);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      fetchBooks();
      return;
    }
    try {
      setLoading(true);
      const res = await searchBooks(search);
      setBooks(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="mb-1">Explore Books</h2>
      
      <form onSubmit={handleSearch} className="controls">
        <input 
          type="text" 
          placeholder="Search by title, author, or genre..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={genre} onChange={(e) => { setGenre(e.target.value); setSearch(''); }}>
          <option value="">All Genres</option>
          {genres.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
        <button type="submit" className="btn-primary">Search</button>
      </form>

      {loading ? (
        <p className="text-center mt-2">Loading books...</p>
      ) : books.length === 0 ? (
        <div className="text-center mt-2 p-2" style={{backgroundColor: 'var(--card-bg)', borderRadius: '8px'}}>
          <p>No books found. Try a different search.</p>
        </div>
      ) : (
        <div className="book-grid">
          {books.map(book => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Explore;
