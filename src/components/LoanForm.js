import React, { useState } from 'react';
import api from '../services/api';
import './LoanForm.css';

const LoanForm = ({ loans = [], monthlyLimit = 50000, onSuccess }) => {
  const [form, setForm] = useState({
    loanType: 'personal',
    principalAmount: '',
    termMonths: '',
    startDate: ''
  });

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
    setSuccessMsg('');
  };

  const getMonthlyLoanTotal = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return loans
      .filter((loan) => {
        if (!loan.startDate) return false;
        const loanDate = new Date(loan.startDate);
        return loanDate.getMonth() === currentMonth && loanDate.getFullYear() === currentYear;
      })
      .reduce((sum, loan) => sum + (loan.principalAmount || 0), 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const requestedAmount = parseFloat(form.principalAmount);
    if (isNaN(requestedAmount) || requestedAmount <= 0) {
      setError('Please enter a valid loan amount.');
      return;
    }

    const monthlyTotal = getMonthlyLoanTotal();
    if (monthlyTotal + requestedAmount > monthlyLimit) {
      setError(
        `Monthly loan limit exceeded. You've already taken M${monthlyTotal.toFixed(2)} this month. The max per month is M${monthlyLimit.toFixed(2)}.`
      );
      return;
    }

    setLoading(true);

    try {
      await api.post('/loans', {
        ...form,
        principalAmount: Number(form.principalAmount),
        termMonths: Number(form.termMonths),
      });

      setSuccessMsg('Loan created successfully!');
      setForm({
        loanType: 'personal',
        principalAmount: '',
        termMonths: '',
        startDate: ''
      });
      setError('');
      if (onSuccess) onSuccess(); // refresh loan list in parent
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to create loan.');
      setSuccessMsg('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="loan-form" onSubmit={handleSubmit} noValidate>
      <h2>Create New Loan</h2>

      <label>
        Loan Type:
        <select name="loanType" value={form.loanType} onChange={handleChange}>
          <option value="personal">Personal</option>
          <option value="home">Home</option>
          <option value="car">Car</option>
          <option value="education">Education</option>
          <option value="business">Business</option>
        </select>
      </label>

      <label>
        Amount (M):
        <input
          type="number"
          name="principalAmount"
          value={form.principalAmount}
          onChange={handleChange}
          required
          min={100}
        />
      </label>

      <label>
        Term (Months):
        <input
          type="number"
          name="termMonths"
          value={form.termMonths}
          onChange={handleChange}
          required
          min={1}
        />
      </label>

      <label>
        Start Date:
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          required
        />
      </label>

      {error && <p className="error-message">{error}</p>}
      {successMsg && <p className="success-message">{successMsg}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Submitting...' : 'Submit Loan'}
      </button>
    </form>
  );
};

export default LoanForm;
