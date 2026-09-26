import { Link } from 'react-router-dom';

function BookCard({ book }) {
  return (
    <div className="book-card">
      <div 
        className="book-cover" 
        style={{ backgroundImage: `url(${book.cover_image || 'https://via.placeholder.com/300x400?text=No+Cover'})` }}
      ></div>
      <div className="book-info">
        <h3 className="book-title">{book.title}</h3>
        <p className="book-author">By {book.author}</p>
        <span className="book-genre">{book.genre}</span>
        <p className="book-description" style={{ flexGrow: 1, color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
          {book.description && book.description.substring(0, 80)}...
        </p>
        <Link to={`/book/${book.id}`} className="btn-primary">View Details</Link>
      </div>
    </div>
  );
}

export default BookCard;
