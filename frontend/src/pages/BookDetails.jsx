import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBookDetails, logActivity, rateBook } from '../services/api';

function BookDetails({ user }) {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [rating, setRating] = useState(0);

  useEffect(() => {
    fetchBook();
    if (user) {
      logActivity(id, 'VIEW').catch(err => console.error(err));
    }
  }, [id, user]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const res = await getBookDetails(id);
      setBook(res.data);
      setRating(res.data.rating ? Math.round(res.data.rating) : 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      setMessage('Please login to save favorites.');
      return;
    }
    try {
      await logActivity(id, 'LIKE');
      setMessage('Added to your favorites!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to like book.');
    }
  };

  const handleRate = async (val) => {
    if (!user) {
      setMessage('Please login to rate books.');
      return;
    }
    try {
      await rateBook(id, val);
      setRating(val);
      setMessage('Your rating has been saved.');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save rating.');
    }
  };

  if (loading) return <p className="text-center">Loading book details...</p>;
  if (!book) return <p className="text-center">Book not found.</p>;

  return (
    <div>
      <Link to="/explore" style={{ color: 'var(--primary-color)', marginBottom: '1rem', display: 'inline-block' }}>
        &larr; Back to Explore
      </Link>
      
      <div className="details-container">
        <div 
          className="details-cover"
          style={{ backgroundImage: `url(${book.cover_image || 'https://via.placeholder.com/300x400?text=No+Cover'})` }}
        ></div>
        
        <div className="details-info">
          <h1>{book.title}</h1>
          <p className="author">By {book.author}</p>
          <span className="book-genre">{book.genre}</span>
          
          <div className="description">
            <p>{book.description}</p>
          </div>

          {message && (
            <div style={{ padding: '0.5rem', backgroundColor: '#d1fae5', color: '#065f46', borderRadius: '4px', marginBottom: '1rem' }}>
              {message}
            </div>
          )}

          <div className="actions">
            <button className="btn-primary" onClick={handleLike}>
              &#10084; Like
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span className="text-muted">Rate:</span>
              {[1, 2, 3, 4, 5].map((star) => (
                <span 
                  key={star} 
                  style={{ cursor: 'pointer', color: star <= rating ? '#fbbf24' : '#d1d5db', fontSize: '1.5rem' }}
                  onClick={() => handleRate(star)}
                >
                  &#9733;
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default BookDetails;
