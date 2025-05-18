// models/Account.js
const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountType: {
    type: String,
    enum: ['credit', 'savings', 'checking', 'mortgage'],
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  openDate: {
    type: Date,
    required: true
  },
  currentBalance: {
    type: Number,
    required: true
  },
  creditLimit: {
    type: Number // Optional; mainly for credit accounts
  },
  paymentHistory: [
    {
      paymentDate: Date,
      amountPaid: Number,
      paymentStatus: {
        type: String,
        enum: ['On-time', 'Late', 'Missed']
      }
    }
  ]
}, { timestamps: true });

const Account = mongoose.model('Account', accountSchema);
module.exports = Account;
