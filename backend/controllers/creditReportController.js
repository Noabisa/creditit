// controllers/creditReportController.js
const Loan = require('../models/Loan');
const User = require('../models/User');

const getCreditReport = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch loans of user
    const loans = await Loan.find({ user: userId });

    // Calculate credit score
    const creditScore = calculateCreditScore(loans);

    // Build report object
    const report = {
      creditScore,
      loans,
      generatedAt: new Date(),
    };

    res.json(report);
  } catch (err) {
    res.status(500).json({ message: 'Failed to generate report', error: err.message });
  }
};

module.exports = { getCreditReport };
