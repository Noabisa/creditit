// routes/accountRoutes.js
const express = require('express');
const { createAccount, getUserAccounts, getAccountById } = require('../controllers/accountController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createAccount);
router.get('/', protect, getUserAccounts);
router.get('/:id', protect, getAccountById);

module.exports = router;
