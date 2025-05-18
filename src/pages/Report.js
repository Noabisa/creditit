import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Report = () => {
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await axios.get('/api/consumer/report');
        setReport(response.data);
      } catch (error) {
        console.error('Error fetching report:', error);
      }
    };
    fetchReport();
  }, []);

  if (!report) return <p>Loading...</p>;

  return (
    <div>
      <h2>My Credit Report</h2>
      <p>Score: {report.score}</p>
      <p>Summary: {report.summary}</p>
      <h3>Payment History:</h3>
      <ul>
        {report.history.map((payment, index) => (
          <li key={index}>
            Date: {new Date(payment.paymentDate).toLocaleDateString()}, Amount Paid: {payment.amountPaid}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Report;
