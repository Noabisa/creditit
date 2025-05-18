import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">CreditIt</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {user ? (
          <>
            {user.role === 'borrower' && (
              <Link to="/dashboard">Dashboard</Link>
            )}
            {user.role === 'admin' && (
              <Link to="/adminpanel">Admin Panel</Link>
            )}
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
