import { useState, useEffect } from 'react';
import { getRecommendations } from '../services/api';
import BookCard from '../components/BookCard';
import { Link } from 'react-router-dom';

function Recommendations({ user }) {
  const [data, setData] = useState({ type: '', message: '', books: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchRecommendations();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      const res = await getRecommendations();
      setData(res.data);
    } catch (err) {
      console.error(err);
      setData({ type: 'error', message: 'Failed to load recommendations.', books: [] });
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="text-center mt-2 p-2" style={{backgroundColor: 'var(--card-bg)', borderRadius: '8px', padding: '3rem'}}>
        <h2>Please Login</h2>
        <p className="text-muted mt-2 mb-1">You need to be logged in to see personalized recommendations.</p>
        <Link to="/login" className="btn-primary mt-2">Go to Login</Link>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>Recommended For You</h2>
      
      {loading ? (
        <p className="text-center mt-2">Finding books you may like...</p>
      ) : (
        <>
          <p className="text-center text-muted mb-1" style={{ fontSize: '1.1rem' }}>{data.message}</p>
          
          {data.books.length === 0 ? (
            <div className="text-center mt-2 p-2">
              <p>No recommendations available yet.</p>
              <Link to="/explore" className="btn-primary mt-2">Explore Books</Link>
            </div>
          ) : (
            <div className="book-grid">
              {data.books.map(book => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Recommendations;
