import bcrypt from 'bcryptjs';
import asyncHandler from '../middlewares/async.middleware.js';
import User from '../models/User.js';

export const createAdmin = asyncHandler(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email }).exec();

    if (userExists) {
      return res
        .status(400)
        .send({ success: false, message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      email,
      password,
    });

    // Get signed token
    const token = user.getSignedJwtToken();

    res.status(201).send({
      success: true,
      message: 'User created successfully',
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      success: false,
      message: 'Error registering new user',
      error: error.message,
    });
  }
});

export const loginUser = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // Check for user existence
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res
        .status(404)
        .send({ success: false, message: 'User not found' });
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .send({ success: false, message: 'Invalid credentials' });
    }

    // If user is found and password is right, create a token
    const token = user.getSignedJwtToken();
console.log(token);
    // Return the token
    res.status(200).send({
      success: true,
      message: 'Login successful',
      token: token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: 'Server error' });
  }
});
