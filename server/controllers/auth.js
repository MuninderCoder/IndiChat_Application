const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;
  
  if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(email)) {
    return res.status(400).json({ message: 'Only Gmail addresses (@gmail.com) are allowed to register' });
  }

  try {
    const existingName = await User.findOne({ username });
    if (existingName) {
      return res.status(400).json({ message: 'Username is already taken' });
    }

    const emailCount = await User.countDocuments({ email });
    if (emailCount >= 3) {
      return res.status(400).json({ message: 'Maximum of 3 accounts allowed per Gmail address' });
    }

    const user = await User.create({ username, email, password });
    if (user) {
      const token = generateToken(user._id, res);
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Error in signup:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await user.comparePassword(password))) {
      const token = generateToken(user._id, res);
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        profilePic: user.profilePic,
        bio: user.bio,
        token,
      });
    } else {
      res.status(400).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    console.error('Error in login:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('jwt');
  res.status(200).json({ message: 'Logged out successfully' });
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.status(200).json(user);
  } catch (error) {
    console.error('Error in getMe:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { profilePic, bio } = req.body;
    const userId = req.user._id;

    const updates = {};
    if (profilePic !== undefined) updates.profilePic = profilePic;
    if (bio !== undefined) updates.bio = bio;

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: 'No fields provided to update' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select('-password');

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in updateProfile:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    await User.findByIdAndDelete(userId);
    res.clearCookie('jwt');
    res.status(200).json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProfile:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addContact = async (req, res) => {
  try {
    const { contactId } = req.body;
    const userId = req.user._id;
    if (userId.toString() === contactId) return res.status(400).json({ message: "Cannot add yourself" });
    
    const user = await User.findById(userId);
    if (!user.contacts.some(id => id.toString() === contactId)) {
        user.contacts.push(contactId);
        await user.save();
    }
    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in addContact:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.removeContact = async (req, res) => {
  try {
    const { contactId } = req.body;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    user.contacts = user.contacts.filter(id => id.toString() !== contactId);
    await user.save();
    
    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in removeContact:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.addFavorite = async (req, res) => {
  try {
    const { contactId } = req.body;
    const userId = req.user._id;
    if (userId.toString() === contactId) return res.status(400).json({ message: "Cannot favorite yourself" });
    
    const user = await User.findById(userId);
    if (!user.favorites.some(id => id.toString() === contactId)) {
        user.favorites.push(contactId);
        await user.save();
    }
    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in addFavorite:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.removeFavorite = async (req, res) => {
  try {
    const { contactId } = req.body;
    const userId = req.user._id;
    
    const user = await User.findById(userId);
    user.favorites = user.favorites.filter(id => id.toString() !== contactId);
    await user.save();
    
    const updatedUser = await User.findById(userId).select('-password');
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error in removeFavorite:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};
