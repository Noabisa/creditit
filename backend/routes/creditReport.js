const express = require('express');
const router = express.Router();
const Loan = require('../models/Loan');
// If you don't cache scores, you can remove this line:
// const CreditReport = require('../models/CreditReport');
const { protect } = require('../middleware/authMiddleware');  // <-- Destructure protect

router.get('/my', protect, async (req, res) => {
  try {
    const userId = req.user._id;  // safer to use _id from Mongoose document
    const loans = await Loan.find({ userId });

    let score = 700;

    loans.forEach(loan => {
      const totalWithInterest = loan.principalAmount * 1.2;
      const totalPaid = loan.paymentHistory.reduce((sum, p) => sum + p.amountPaid, 0);
      const repaymentRatio = totalPaid / totalWithInterest;

      if (loan.status === 'completed') score += 30;
      if (repaymentRatio >= 0.9) score += 20;
      if (repaymentRatio < 0.5) score -= 40;
    });

    score = Math.max(300, Math.min(score, 850));

    const report = {
      creditScore: score,
      totalLoans: loans.length,
      completedLoans: loans.filter(l => l.status === 'completed').length,
      activeLoans: loans.filter(l => l.status !== 'completed').length,
      totalPaid: loans.reduce((sum, l) => sum + l.paymentHistory.reduce((s, p) => s + p.amountPaid, 0), 0),
      totalOwed: loans.reduce((sum, l) => sum + (l.principalAmount * 1.2), 0),
      paymentHistory: loans.flatMap(l => l.paymentHistory),
    };

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Error calculating credit score' });
  }
});

module.exports = router;
