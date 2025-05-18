const Loan = require('../models/Loan');
const calculateCreditScore = require('../utils/calculateCreditScore');
const CreditScore = require('../models/CreditScore');

// Create new loan ensuring monthly cap & update score
const createLoan = async (req, res) => {
  try {
    const userId = req.user.id;
    const { principalAmount } = req.body;

    // Current month date range
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Loans created this month by user
    const monthlyLoans = await Loan.find({
      user: userId,
      createdAt: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const totalThisMonth = monthlyLoans.reduce((sum, loan) => sum + loan.principalAmount, 0);

    if ((totalThisMonth + Number(principalAmount)) > 50000) {
      return res.status(400).json({
        message: 'Monthly loan limit of M50,000 exceeded. Try again next month or request smaller amount.',
      });
    }

    // Save new loan
    const loan = new Loan({
      ...req.body,
      interestRate: 20,
      user: userId,
    });

    await loan.save();

    // Recalculate and save credit score after loan creation
    await calculateAndSaveScore(userId);

    res.status(201).json(loan);
  } catch (err) {
    res.status(400).json({ message: 'Error creating loan', error: err.message });
  }
};

// Get all loans for user
const getUserLoans = async (req, res) => {
  try {
    const loans = await Loan.find({ user: req.user.id });
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching loans', error: err.message });
  }
};

// Repay a loan, mark completed if fully paid, update credit score
const repayLoan = async (req, res) => {
  const { loanId } = req.params;
  const { amount } = req.body;

  try {
    const loan = await Loan.findOne({ _id: loanId, user: req.user.id });
    if (!loan) return res.status(404).json({ message: 'Loan not found' });

    loan.paymentHistory.push({
      paymentDate: new Date(),
      amountPaid: amount,
      paymentStatus: 'On-time', // Ideally logic to determine late/on-time here
    });

    const totalPaid = loan.paymentHistory.reduce((sum, p) => sum + p.amountPaid, 0);
    const totalWithInterest = loan.principalAmount * 1.2;

    if (totalPaid >= totalWithInterest) loan.status = 'completed';

    await loan.save();

    // Update score after repayment
    await calculateAndSaveScore(req.user.id);

    res.json({ message: 'Repayment successful', loan });
  } catch (err) {
    res.status(400).json({ message: 'Payment failed', error: err.message });
  }
};

// Calculate and save credit score snapshot
const calculateAndSaveScore = async (userId) => {
  const result = await calculateCreditScore(userId);

  // Optionally, delete previous scores if you want to keep only the latest
  // await CreditScore.deleteMany({ user: userId });

  await CreditScore.create({
    user: userId,
    score: result.score,
    calculatedOn: new Date(),
    scoreFactors: result.factors,
  });
};

// Admin fetch all loans (with user info)
const getAllLoans = async (req, res) => {
  try {
    const loans = await Loan.find().populate('user', 'name email');
    res.json(loans);
  } catch (err) {
    res.status(500).json({ message: 'Failed to retrieve loans', error: err.message });
  }
};
// Delete a loan by ID (Admin only)
const deleteLoan = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedLoan = await Loan.findByIdAndDelete(id);

    if (!deletedLoan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    res.status(200).json({ message: 'Loan deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete loan', error: err.message });
  }
};

module.exports = {
  createLoan,
  getUserLoans,
  repayLoan,
  getAllLoans,
  deleteLoan,
};
