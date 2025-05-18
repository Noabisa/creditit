import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import './Login.css';

const Login = () => {
  const { login } = useContext(AuthContext) || {}; // fallback for safety
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', form);
      const { user, token } = res.data;

      if (login) login(user, token);

      // Redirect based on role
      if (user.role === 'admin') {
        navigate('/adminpanel');
      } else if (user.role === 'borrower') {
        navigate('/dashboard'); // You had `/borrower-dashboard`, but your route is `/dashboard`
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Login Error:', err);
      setError(err.response?.data?.message || 'Login failed. Try again.');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 className="login-title">Login</h2>

        {error && <p className="error-message">{error}</p>}

        <div className="input-group">
          <span className="input-icon"><FaEnvelope /></span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <span className="input-icon"><FaLock /></span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-btn">Login</button>

        <p className="signup-link">
          Don&apos;t have an account? <Link to="/signup">Sign up here</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
