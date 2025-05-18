// controllers/creditScoreController.js
const CreditScore = require('../models/CreditScore');
const calculateCreditScore = require('../utils/calculateCreditScore');

const generateScore = async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await calculateCreditScore(userId);

    const saved = await CreditScore.create({
      user: userId,
      score: result.score,
      calculatedOn: new Date(),
      scoreFactors: result.factors
    });

    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Failed to calculate score', error: err.message });
  }
};

const getScore = async (req, res) => {
  try {
    const score = await CreditScore.findOne({ user: req.user.id }).sort({ calculatedOn: -1 });
    if (!score) return res.status(404).json({ message: 'Score not found' });
    res.json(score);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching score', error: err.message });
  }
};

module.exports = { generateScore, getScore };
