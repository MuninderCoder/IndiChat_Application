const jwt = require('jsonwebtoken');

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });

  // Set as cookie or return in response - for this MVP, we will return it in response
  // but also show how to set it as a cookie for security
  res.cookie('jwt', token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    httpOnly: true, // prevent XSS
    sameSite: 'strict', // prevent CSRF
    secure: process.env.NODE_ENV !== 'development',
  });

  return token;
};

module.exports = generateToken;
