const express = require('express');
const { getAllUsers, getUserById, deleteUser, getCurrentUserProfile } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

const router = express.Router();

//router.get('/me', protect, getCurrentUserProfile); // use the new controller here
router.get('/', protect, adminOnly, getAllUsers);
router.get('/:id', protect, adminOnly, getUserById);
router.delete('/:id', protect, adminOnly, deleteUser);

module.exports = router;
