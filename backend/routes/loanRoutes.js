const express = require('express');
const {
  createLoan,
  getUserLoans,
  repayLoan,
  getAllLoans,
  deleteLoan,
} = require('../controllers/loanController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createLoan);
router.get('/', protect, getUserLoans);
router.post('/:loanId/repay', protect, repayLoan); // Use loanId for clarity
router.get('/all', protect, adminOnly, getAllLoans);
router.delete('/:id', protect, adminOnly, deleteLoan); // <-- Added route

module.exports = router;
