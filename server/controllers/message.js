const User = require('../models/User');
const Message = require('../models/Message');

exports.getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password').lean();
    
    const usersWithStatus = await Promise.all(filteredUsers.map(async (u) => {
        const unreadMsg = await Message.findOne({
            senderId: u._id,
            receiverId: loggedInUserId,
            status: { $ne: 'seen' }
        }).sort({ createdAt: -1 });

        const anyMsg = await Message.findOne({
            $or: [
               { senderId: loggedInUserId, receiverId: u._id },
               { senderId: u._id, receiverId: loggedInUserId }
            ]
        }).sort({ createdAt: -1 });

        return {
            ...u,
            hasUnread: !!unreadMsg,
            unreadText: unreadMsg ? (unreadMsg.text || '📷 Photo') : null,
            hasHistory: !!anyMsg,
            lastMessageText: anyMsg ? (anyMsg.text || '📷 Photo') : null
        };
    }));

    res.status(200).json(usersWithStatus);
  } catch (error) {
    console.error('Error in getUsersForSidebar:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error in getMessages:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image,
    });

    await newMessage.save();

    // Socket.io logic will be handled in the socket handler, 
    // but here we return the saved message
    res.status(201).json(newMessage);
  } catch (error) {
    console.error('Error in sendMessage:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateMessageStatus = async (req, res) => {
  try {
    const { messageId, status } = req.body;
    const message = await Message.findByIdAndUpdate(messageId, { status }, { new: true });
    res.status(200).json(message);
  } catch (error) {
    console.error('Error in updateMessageStatus:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.editMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const message = await Message.findOne({ _id: id, senderId: req.user._id });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    message.text = text;
    message.isEdited = true;
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    console.error('Error in editMessage:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findOne({ _id: id, senderId: req.user._id });
    if (!message) return res.status(404).json({ message: 'Message not found' });
    message.isDeleted = true;
    message.text = '';
    message.image = '';
    await message.save();
    res.status(200).json(message);
  } catch (error) {
    console.error('Error in deleteMessage:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

