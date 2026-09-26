import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <div className="hero">
        <h1>Discover Your Next Favorite Book</h1>
        <p>Explore books and get personalized recommendations based on your interests.</p>
        <Link to="/explore" className="btn-primary">Explore Books</Link>
      </div>

      <div style={{ marginTop: '4rem' }}>
        <h2 className="text-center mb-1">How Recommendations Work</h2>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          gap: '2rem',
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <div style={{ flex: 1, padding: '1.5rem', backgroundColor: 'var(--card-bg)', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>1. Read & Interact</h3>
            <p className="text-muted">Explore books, view their details, and rate the ones you like.</p>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', backgroundColor: 'var(--card-bg)', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>2. AI Analysis</h3>
            <p className="text-muted">Our AI uses TF-IDF and Cosine Similarity to find books with similar themes and descriptions.</p>
          </div>
          <div style={{ flex: 1, padding: '1.5rem', backgroundColor: 'var(--card-bg)', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>3. Get Recommendations</h3>
            <p className="text-muted">Visit 'My Recommendations' to see personalized suggestions just for you.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
