const Loan = require('../models/Loan');

async function calculateCreditScore(userId) {
  const loans = await Loan.find({ user: userId });

  if (loans.length === 0) {
    return { score: 700, factors: { reason: 'No loans yet, neutral score' } }; 
    // You can define a base default score here
  }

  let totalLoans = loans.length;
  let totalPrincipal = 0;
  let totalPaid = 0;
  let totalDue = 0;
  let onTimePayments = 0;
  let latePayments = 0;

  loans.forEach((loan) => {
    totalPrincipal += loan.principalAmount;
    const totalWithInterest = loan.principalAmount * (1 + loan.interestRate / 100);
    
    // Sum all payments for this loan
    let loanPaid = loan.paymentHistory.reduce((sum, payment) => {
      if(payment.paymentStatus === 'On-time') onTimePayments++;
      else if(payment.paymentStatus === 'Late') latePayments++;
      return sum + payment.amountPaid;
    }, 0);

    totalPaid += loanPaid;
    totalDue += totalWithInterest;

    // Potential default check: loan not completed but past due date could be flagged here
    // For now, just track payments status counts
  });

  // Payment punctuality ratio
  const totalPayments = onTimePayments + latePayments;
  const onTimeRatio = totalPayments > 0 ? (onTimePayments / totalPayments) : 1;

  // Basic scoring logic (customize as needed):
  // Start from 500 baseline
  // +50 for fewer loans
  // +50 for high on-time payment ratio
  // - (total owed to total principal ratio) to penalize high debt
  // Cap at 850, floor at 300

  let score = 500;

  // Reward fewer loans (max +50 if <= 3 loans)
  score += totalLoans <= 3 ? 50 : Math.max(0, 50 - (totalLoans - 3) * 5);

  // Reward payment punctuality up to +100
  score += onTimeRatio * 100;

  // Penalize high debt ratio (totalDue/totalPaid)
  if(totalPaid === 0) {
    score -= 100; // No payments yet
  } else {
    const debtRatio = totalDue / totalPaid;
    if(debtRatio > 1) {
      score -= (debtRatio - 1) * 100; // penalize ratio above 1
    }
  }

  // Clamp score
  score = Math.round(Math.min(Math.max(score, 300), 850));

  return {
    score,
    factors: {
      totalLoans,
      totalPrincipal,
      totalPaid,
      totalDue,
      onTimePayments,
      latePayments,
      onTimeRatio: onTimeRatio.toFixed(2),
    },
  };
}

module.exports = calculateCreditScore;
