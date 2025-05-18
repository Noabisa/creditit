const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanType: {
    type: String,
    enum: ['personal', 'home', 'car', 'education', 'business'],
    required: true
  },
  principalAmount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    default: 20, // Enforce 20% interest rate
    immutable: true
  },
  termMonths: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: Date,
  status: {
    type: String,
    enum: ['ongoing', 'completed', 'defaulted'],
    default: 'ongoing'
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

loanSchema.pre('save', function (next) {
  if (!this.endDate && this.startDate && this.termMonths) {
    const end = new Date(this.startDate);
    end.setMonth(end.getMonth() + this.termMonths);
    this.endDate = end;
  }
  this.interestRate = 20; // Enforce 20%
  next();
});

const Loan = mongoose.model('Loan', loanSchema);
module.exports = Loan;
