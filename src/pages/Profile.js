import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState(user || {});
  const [passwords, setPasswords] = useState({ current: '', new: '' });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // If no user prop passed, fetch the profile
    if (!user) {
      api.get('/users/me')
        .then(res => setProfile(res.data))
        .catch(err => console.error('Failed to load profile:', err));
    }
  }, [user]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      // Update profile info (excluding password)
      await api.put('/users/me', {
        name: profile.name,
        email: profile.email,
      });
      setMessage('Profile updated successfully.');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setMessage('');
    try {
      await api.put('/users/me/password', {
        currentPassword: passwords.current,
        newPassword: passwords.new,
      });
      setMessage('Password changed successfully.');
      setPasswords({ current: '', new: '' });
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to change password.');
    }
  };

  return (
    <div className="profile">
      <h2>Your Profile</h2>
      {message && <p style={{ color: 'green' }}>{message}</p>}

      <form onSubmit={handleUpdateProfile}>
        <label>
          Name:<br />
          <input
            type="text"
            name="name"
            value={profile.name || ''}
            onChange={handleChange}
            required
          />
        </label><br />

        <label>
          Email:<br />
          <input
            type="email"
            name="email"
            value={profile.email || ''}
            onChange={handleChange}
            required
          />
        </label><br />

        <button type="submit">Update Profile</button>
      </form>

      <hr />

      <h3>Change Password</h3>
      <form onSubmit={handleChangePassword}>
        <label>
          Current Password:<br />
          <input
            type="password"
            name="current"
            value={passwords.current}
            onChange={handlePasswordChange}
            required
          />
        </label><br />

        <label>
          New Password:<br />
          <input
            type="password"
            name="new"
            value={passwords.new}
            onChange={handlePasswordChange}
            required
          />
        </label><br />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default Profile;
