const express = require('express');
const router = express.Router();
const { getUsersForSidebar, getMessages, sendMessage, updateMessageStatus, editMessage, deleteMessage } = require('../controllers/message');
const { protect } = require('../middleware/auth');

router.get('/users', protect, getUsersForSidebar);
router.get('/:id', protect, getMessages);
router.post('/send/:id', protect, sendMessage);
router.put('/status', protect, updateMessageStatus);
router.put('/edit/:id', protect, editMessage);
router.put('/delete/:id', protect, deleteMessage);

module.exports = router;
