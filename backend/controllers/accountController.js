// controllers/accountController.js
const Account = require('../models/Account');

const createAccount = async (req, res) => {
  try {
    const account = new Account({ ...req.body, user: req.user.id });
    await account.save();
    res.status(201).json(account);
  } catch (err) {
    res.status(400).json({ message: 'Failed to create account', error: err.message });
  }
};

const getUserAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching accounts', error: err.message });
  }
};

const getAccountById = async (req, res) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, user: req.user.id });
    if (!account) return res.status(404).json({ message: 'Account not found' });
    res.json(account);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching account', error: err.message });
  }
};

module.exports = { createAccount, getUserAccounts, getAccountById };
