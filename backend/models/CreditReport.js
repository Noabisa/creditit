const mongoose = require('mongoose');

const creditReportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creditScore: { type: Number, required: true },
  totalLoans: { type: Number, default: 0 },
  totalOutstandingAmount: { type: Number, default: 0 },
  missedPayments: { type: Number, default: 0 },
  remarks: { type: String },
  reportDate: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('CreditReport', creditReportSchema);
