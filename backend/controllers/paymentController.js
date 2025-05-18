const Payment = require('../models/Payment');
const Application = require('../models/LoanApplication');

exports.makePayment = async (req, res) => {
  try {
    const { applicationId, amount } = req.body;

    if (!applicationId || !amount) {
      return res.status(400).json({ message: 'Application ID and amount are required' });
    }

    const application = await Application.findById(applicationId).populate('user');

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    if (application.user._id.toString() !== req.user.id) {
      return res.status(403).json({ message: 'You are not authorized to pay this loan' });
    }

    if (application.paid) {
      return res.status(400).json({ message: 'Loan has already been paid' });
    }

    const payment = new Payment({
      application: application._id,
      amount,
      paidBy: req.user.id,
      paidAt: new Date(),
    });

    await payment.save();

    application.paid = true;
    await application.save();

    res.status(200).json({ message: 'Payment successful', payment });
  } catch (err) {
    console.error('Error processing payment:', err);
    res.status(500).json({ message: 'Server error processing payment' });
  }
};
