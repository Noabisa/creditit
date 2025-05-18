import React, { useEffect, useState } from 'react';
import CreditScoreCard from '../components/CreditScoreCard';
import CreditReportViewer from '../components/CreditReportViewer';
import LoanForm from '../components/LoanForm';
import Footer  from '../components/Footer';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import api from '../services/api';
import './Dashboard.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Dashboard = () => {
  const [creditData, setCreditData] = useState(null);
  const [loans, setLoans] = useState([]);
  const [totals, setTotals] = useState({ totalOwed: 0, totalPaid: 0, remaining: 0 });
  const [loadingCreditData, setLoadingCreditData] = useState(true);
  const [loadingLoans, setLoadingLoans] = useState(true);

  const fetchCreditData = async () => {
    setLoadingCreditData(true);
    try {
      const res = await api.get('/credit-reports/my');
      setCreditData(res.data);
    } catch (err) {
      console.error('Error fetching credit data:', err);
      setCreditData(null);
    } finally {
      setLoadingCreditData(false);
    }
  };

  const fetchLoans = async () => {
    setLoadingLoans(true);
    try {
      const res = await api.get('/loans');
      setLoans(res.data);
      calculateTotals(res.data);
    } catch (err) {
      console.error('Error fetching loans:', err);
      setLoans([]);
      setTotals({ totalOwed: 0, totalPaid: 0, remaining: 0 });
    } finally {
      setLoadingLoans(false);
    }
  };

  const calculateTotals = (loans) => {
    let totalOwed = 0;
    let totalPaid = 0;

    loans.forEach((loan) => {
      const interest = loan.principalAmount * 0.2;
      const loanTotal = loan.principalAmount + interest;
      totalOwed += loanTotal;

      const paid = loan.paymentHistory.reduce((sum, p) => sum + p.amountPaid, 0);
      totalPaid += paid;
    });

    const remaining = totalOwed - totalPaid;
    setTotals({ totalOwed, totalPaid, remaining });
  };

  const handleRepay = async (loanId) => {
    const loan = loans.find(l => l._id === loanId);
    if (!loan) return alert('Loan not found');

    const totalWithInterest = loan.principalAmount * 1.2;
    const totalPaid = loan.paymentHistory.reduce((sum, p) => sum + p.amountPaid, 0);
    const remaining = totalWithInterest - totalPaid;

    let amountInput = prompt(`Enter payment amount (max M${remaining.toFixed(2)}):`);
    if (!amountInput || isNaN(amountInput.trim())) return alert('Invalid amount');

    let amount = parseFloat(amountInput);
    if (amount <= 0) return alert('Payment amount must be greater than zero');
    if (amount > remaining) {
      amount = remaining;
      alert(`Amount exceeds balance. Adjusted to M${amount.toFixed(2)}`);
    }

    try {
      await api.post(`/loans/${loanId}/repay`, { amount });
      alert('Payment successful');
      await fetchLoans();
      await fetchCreditData();
    } catch (err) {
      alert(`Payment failed: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDownloadReport = () => {
    if (!creditData) return;

    const dataStr = JSON.stringify(creditData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'credit_report.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const pieData = {
    labels: ['Paid', 'Remaining'],
    datasets: [
      {
        data: [totals.totalPaid, totals.remaining],
        backgroundColor: ['#4caf50', '#f44336'],
        hoverOffset: 10,
      },
    ],
  };

  useEffect(() => {
    fetchCreditData();
    fetchLoans();
  }, []);

  return (
    <div className="dashboard">
      <h1>Welcome to Your Dashboard</h1>

      {loadingCreditData ? (
        <p>Loading credit data...</p>
      ) : creditData ? (
        <>
          {/* Pass scoreFactors here */}
          <CreditScoreCard 
            score={creditData.creditScore} 
            factors={creditData.scoreFactors} 
          />
          <CreditReportViewer report={creditData} />
          <button className="download-button" onClick={handleDownloadReport}>
            Download Credit Report
          </button>
        </>
      ) : (
        <p>Failed to load credit data.</p>
      )}

      <section className="summary-section">
        <h2>Loan Summary</h2>
        {loadingLoans ? (
          <p>Loading loans...</p>
        ) : loans.length === 0 ? (
          <p>No loans found.</p>
        ) : (
          <>
            <p><strong>Total Owed (incl. 20% interest):</strong> M{totals.totalOwed.toFixed(2)}</p>
            <p><strong>Total Paid:</strong> M{totals.totalPaid.toFixed(2)}</p>
            <p><strong>Remaining Balance:</strong> M{totals.remaining.toFixed(2)}</p>

            <div className="chart-container">
              <h3>Payment Trend</h3>
              <Pie data={pieData} />
            </div>
          </>
        )}
      </section>

      <LoanForm
        loans={loans}
        monthlyLimit={50000}
        onSuccess={() => {
          fetchLoans();
          fetchCreditData();
        }}
      />

      <section className="loans-section">
        <h2>Your Loans</h2>
        {loadingLoans ? (
          <p>Loading loans...</p>
        ) : loans.length > 0 ? (
          <div className="loan-cards-container">
            {loans.map((loan) => {
              const totalWithInterest = loan.principalAmount * 1.2;
              const totalPaid = loan.paymentHistory.reduce((sum, p) => sum + p.amountPaid, 0);
              const percentPaid = Math.min((totalPaid / totalWithInterest) * 100, 100).toFixed(1);
              const isComplete = loan.status === 'completed';

              return (
                <div key={loan._id} className="loan-card">
                  <div className="loan-card-header">
                    <h3>{loan.loanType.toUpperCase()}</h3>
                    <span className={`status-badge ${isComplete ? 'completed' : 'active'}`}>
                      {loan.status}
                    </span>
                  </div>

                  <p><strong>Principal:</strong> M{loan.principalAmount.toFixed(2)}</p>
                  <p><strong>Total w/ Interest:</strong> M{totalWithInterest.toFixed(2)}</p>
                  <p><strong>Paid:</strong> M{totalPaid.toFixed(2)}</p>

                  <div className="progress-bar" aria-label="Loan repayment progress">
                    <div
                      className="progress-fill"
                      style={{
                        width: `${percentPaid}%`,
                        backgroundColor: isComplete ? 'green' : '#3498db',
                      }}
                    />
                  </div>
                  <small>{percentPaid}% repaid</small>

                  <button
                    className="repay-button"
                    onClick={() => handleRepay(loan._id)}
                    disabled={isComplete}
                  >
                    {isComplete ? 'Paid Off' : 'Make Payment'}
                  </button>
                </div>
              );
            })}
          </div>
        ) : (
          <p>No loans found.</p>
        )}
      </section>
      <Footer />
    </div>
  );
};

export default Dashboard;
