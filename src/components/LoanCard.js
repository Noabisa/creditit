import React from 'react';

const LoanCard = ({ loan, onApprove }) => {
  return (
    <div className="loan-card">
      <p><strong>Loan ID:</strong> {loan._id}</p>
      <p><strong>Amount:</strong> {loan.amount}</p>
      <p><strong>Status:</strong> {loan.status}</p>
      <p><strong>Total Payable:</strong> {loan.totalPayable}</p>

      {loan.status === 'pending' && onApprove && (
        <>
          <button onClick={() => onApprove(loan._id, 'approved')}>Approve</button>
          <button onClick={() => onApprove(loan._id, 'rejected')}>Reject</button>
        </>
      )}
    </div>
  );
};

export default LoanCard;
