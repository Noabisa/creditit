import React, { useEffect, useState } from 'react';
import api from '../services/api';
import './AdminPanel.css';
import Footer from '../components/Footer';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale,
} from 'chart.js';
import 'chartjs-adapter-date-fns';

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
  TimeScale
);

const AdminPanel = () => {
  const [loans, setLoans] = useState([]);
  const [originalLoans, setOriginalLoans] = useState([]);
  const [totalIncome, setTotalIncome] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');

  useEffect(() => {
    fetchLoans();
  }, []);

  const fetchLoans = async () => {
    const res = await api.get('/loans/all');
    const loans = res.data;
    setLoans(loans);
    setOriginalLoans(loans);

    let income = 0;
    loans.forEach((loan) => {
      income += loan.paymentHistory.reduce((sum, p) => sum + p.amountPaid, 0);
    });
    setTotalIncome(income);
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = originalLoans.filter(
      (loan) =>
        loan.user.name.toLowerCase().includes(value) ||
        loan.user.email.toLowerCase().includes(value)
    );
    setLoans(filtered);
  };

  const handleSort = (e) => {
    const key = e.target.value;
    setSortBy(key);
    const sorted = [...loans].sort((a, b) => {
      if (key === 'name') return a.user.name.localeCompare(b.user.name);
      if (key === 'status') return a.status.localeCompare(b.status);
      if (key === 'principal') return b.principalAmount - a.principalAmount;
      return 0;
    });
    setLoans(sorted);
  };

  const handleDelete = async (loanId) => {
    try {
      await api.delete(`/loans/${loanId}`);
      const updatedLoans = originalLoans.filter((loan) => loan._id !== loanId);
      setOriginalLoans(updatedLoans);
      const filtered = updatedLoans.filter(
        (loan) =>
          loan.user.name.toLowerCase().includes(searchTerm) ||
          loan.user.email.toLowerCase().includes(searchTerm)
      );
      setLoans(filtered);
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  // Charts
  const barChartData = {
    labels: originalLoans.map((l) => l.user.name),
    datasets: [
      {
        label: 'Amount Paid (M)',
        data: originalLoans.map((l) =>
          l.paymentHistory.reduce((sum, p) => sum + p.amountPaid, 0)
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const loanStatusCounts = originalLoans.reduce((acc, loan) => {
    acc[loan.status] = (acc[loan.status] || 0) + 1;
    return acc;
  }, {});

  const pieChartData = {
    labels: Object.keys(loanStatusCounts),
    datasets: [
      {
        label: 'Loan Status Distribution',
        data: Object.values(loanStatusCounts),
        backgroundColor: ['#198754', '#ffc107', '#dc3545', '#0d6efd'],
        hoverOffset: 30,
      },
    ],
  };

  const paymentsByDate = {};
  originalLoans.forEach((loan) => {
    loan.paymentHistory.forEach((p) => {
      if (p.date) {
        const parsedDate = new Date(p.date);
        if (!isNaN(parsedDate)) {
          const date = parsedDate.toISOString().slice(0, 10);
          paymentsByDate[date] = (paymentsByDate[date] || 0) + p.amountPaid;
        }
      }
    });
  });

  const sortedDates = Object.keys(paymentsByDate).sort();
  const lineChartData = {
    labels: sortedDates,
    datasets: [
      {
        label: 'Total Repayments (M)',
        data: sortedDates.map((date) => paymentsByDate[date]),
        fill: false,
        borderColor: 'rgba(255, 99, 132, 0.7)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.2,
      },
    ],
  };

  const lineChartOptions = {
    scales: {
      x: {
        type: 'time',
        time: { unit: 'day', tooltipFormat: 'PP' },
        title: { display: true, text: 'Date' },
      },
      y: {
        title: { display: true, text: 'Amount (M)' },
      },
    },
  };

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <h3>Total Income from Loan Repayments: M{totalIncome.toFixed(2)}</h3>

      <div className="chart-container">
        <h4>Amount Paid per Borrower</h4>
        <Bar data={barChartData} />
      </div>

      <div className="chart-container">
        <h4>Loan Status Distribution</h4>
        <Pie data={pieChartData} />
      </div>

      <div className="chart-container">
        <h4>Total Repayments Over Time</h4>
        <Line data={lineChartData} options={lineChartOptions} />
      </div>

      <h3>Borrower Loans</h3>
      <div className="controls">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={handleSearch}
        />
        <select onChange={handleSort} value={sortBy}>
          <option value="">Sort By</option>
          <option value="name">Name (A-Z)</option>
          <option value="status">Status</option>
          <option value="principal">Principal Amount</option>
        </select>
      </div>

      <div className="table-wrapper">
        <table className="loans-table">
          <thead>
            <tr>
              <th>Loan ID</th>
              <th>Borrower</th>
              <th>Type</th>
              <th>Status</th>
              <th>Principal (M)</th>
              <th>Interest (20%)</th>
              <th>Total Receivable</th>
              <th>Total Paid</th>
              <th>Remaining</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loans.map((loan) => {
              const interest = loan.principalAmount * 0.2;
              const totalReceivable = loan.principalAmount + interest;
              const totalPaid = loan.paymentHistory.reduce(
                (sum, p) => sum + p.amountPaid,
                0
              );
              const remaining = totalReceivable - totalPaid;

              return (
                <tr key={loan._id}>
                  <td>{loan._id}</td>
                  <td>
                    {loan.user.name}
                    <br />
                    <small>{loan.user.email}</small>
                  </td>
                  <td>{loan.loanType}</td>
                  <td>{loan.status}</td>
                  <td>{loan.principalAmount.toFixed(2)}</td>
                  <td>{interest.toFixed(2)}</td>
                  <td>{totalReceivable.toFixed(2)}</td>
                  <td>{totalPaid.toFixed(2)}</td>
                  <td>{remaining.toFixed(2)}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(loan._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPanel;
