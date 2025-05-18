const mongoose = require('mongoose');

const CreditScoreSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  calculatedOn: { type: Date, default: Date.now },
  scoreFactors: { type: Object }, // e.g. { totalLoans: 3, onTimePayments: 90, latePayments: 2, ... }
});

module.exports = mongoose.model('CreditScore', CreditScoreSchema);
