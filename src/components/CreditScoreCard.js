import React from 'react';
import './CreditScoreCard.css';

const CreditScoreCard = ({ score }) => {
  return (
    <div className="credit-score-card">
      <h2>Credit Score</h2>
      <div className="score">{score}</div>
      <p>{score >= 750 ? 'Excellent' : score >= 650 ? 'Good' : 'Needs Improvement'}</p>
    </div>
  );
};

export default CreditScoreCard;
