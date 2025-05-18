const LoanApplication = require('../models/LoanApplication');
const LoanOffer = require('../models/LoanOffer');
const User = require('../models/User');

// POST /api/applications/apply
exports.applyForLoan = async (req, res) => {
  const { borrower, loanOffer, reason } = req.body;

  // 1. Validate input
  if (!borrower || !loanOffer || !reason?.trim()) {
    return res.status(400).json({ message: 'Missing required fields: borrower, loanOffer, or reason.' });
  }

  try {
    // 2. Optional: Check if user already applied to this offer
    const existing = await LoanApplication.findOne({ borrower, loanOffer });
    if (existing) {
      return res.status(400).json({ message: 'You have already applied for this loan offer.' });
    }

    // 3. Optional: Validate existence of referenced documents
    const userExists = await User.exists({ _id: borrower });
    const offerExists = await LoanOffer.exists({ _id: loanOffer });
    if (!userExists || !offerExists) {
      return res.status(404).json({ message: 'Invalid borrower or loan offer.' });
    }

    // 4. Save new application
    const newApp = new LoanApplication({
      borrower,
      loanOffer,
      reason: reason.trim(),
    });

    await newApp.save();

    return res.status(201).json({ message: 'Loan application submitted successfully.' });
  } catch (err) {
    console.error('Error applying for loan:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
