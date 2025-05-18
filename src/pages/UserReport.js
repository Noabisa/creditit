import React, { useState } from 'react';
import axios from 'axios';

const UserReport = () => {
  const [userId, setUserId] = useState('');
  const [report, setReport] = useState(null);
  const [error, setError] = useState('');

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/reports/${userId}`);
      setReport(response.data);
      setError('');
    } catch (err) {
      setError('Error fetching report. Please ensure the User ID is correct and you have access.');
      setReport(null);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>User Credit Report</h2>
      <input
        type="text"
        placeholder="Enter User ID"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        style={{ padding: '0.5rem', marginRight: '0.5rem' }}
      />
      <button onClick={fetchReport} style={{ padding: '0.5rem 1rem' }}>
        Fetch Report
      </button>

      {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}

      {report && (
        <div style={{ marginTop: '1.5rem' }}>
          <p><strong>Score:</strong> {report.score}</p>
          <p><strong>Summary:</strong> {report.summary}</p>
          <h3>Payment History</h3>
          <ul>
            {report.history.map((entry, idx) => (
              <li key={idx}>
                Date: {new Date(entry.paymentDate).toLocaleDateString()} | Amount Paid: {entry.amountPaid}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default UserReport;
