import React, { useState } from 'react';

const AccountForm = ({ onSubmit }) => {
  const [account, setAccount] = useState({
    accountType: 'savings',
    balance: '',
    institution: '',
  });

  const handleChange = (e) => {
    setAccount({ ...account, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(account);
  };

  return (
    <form onSubmit={handleSubmit} className="form-container">
      <h2>Add Account</h2>
      <select name="accountType" value={account.accountType} onChange={handleChange}>
        <option value="savings">Savings</option>
        <option value="checking">Checking</option>
        <option value="credit">Credit</option>
      </select>
      <input type="number" name="balance" placeholder="Balance" value={account.balance} onChange={handleChange} required />
      <input type="text" name="institution" placeholder="Institution Name" value={account.institution} onChange={handleChange} required />
      <button type="submit">Add Account</button>
    </form>
  );
};

export default AccountForm;
