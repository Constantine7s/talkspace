const asyncHandler = require('express-async-handler');
const User = require('../models/userModel');

const resgisterUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Please enter all required information');
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error('User with this email already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      pic: user.pic,
    });
  } else {
    res.status(400);
    throw new Error('Failed to create user');
  }
});

module.exports = {resgisterUser}