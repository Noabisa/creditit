const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
  application: { type: mongoose.Schema.Types.ObjectId, ref: 'Application', required: true },
  amount: { type: Number, required: true },
  paidAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', PaymentSchema);
