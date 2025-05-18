import React from 'react';

const LoanList = ({ loans, onRepay }) => {
  return (
    <div>
      <h2>Your Loans</h2>
      {loans.length === 0 ? (
        <p>No loans found.</p>
      ) : (
        <ul>
          {loans.map((loan) => (
            <li key={loan._id}>
              <strong>{loan.loanType}</strong> - ${loan.principalAmount} - Status: {loan.status}
              <button onClick={() => onRepay(loan._id)} disabled={loan.status !== 'ongoing'}>
                Repay
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LoanList;
