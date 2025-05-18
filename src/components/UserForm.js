import React, { useState } from 'react';

const UserForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    name: initialData.name || '',
    email: initialData.email || '',
    password: '',
    role: initialData.role || 'borrower',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>{initialData._id ? 'Update User' : 'Register User'}</h2>
      <input type="text" name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} required={!initialData._id} />
      <select name="role" value={formData.role} onChange={handleChange}>
        <option value="borrower">Borrower</option>
        <option value="admin">Admin</option>
      </select>
      <button type="submit">{initialData._id ? 'Update' : 'Register'}</button>
    </form>
  );
};

export default UserForm;
