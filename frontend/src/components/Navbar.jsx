import { Link, useNavigate } from 'react-router-dom';

function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">Booksy</Link>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/explore">Explore Books</Link>
        
        {user ? (
          <>
            <Link to="/recommendations">My Recommendations</Link>
            <span style={{color: 'var(--text-muted)'}}>| Hi, {user.name}</span>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <Link to="/login" className="nav-btn">Login / Register</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
