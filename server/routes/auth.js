const express = require('express');
const router = express.Router();
const { signup, login, logout, getMe, updateProfile, deleteProfile, addContact, removeContact, addFavorite, removeFavorite } = require('../controllers/auth');
const { protect } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', protect, getMe);
router.put('/update-profile', protect, updateProfile);
router.delete('/delete-profile', protect, deleteProfile);
router.put('/add-contact', protect, addContact);
router.put('/remove-contact', protect, removeContact);
router.put('/add-favorite', protect, addFavorite);
router.put('/remove-favorite', protect, removeFavorite);

module.exports = router;
