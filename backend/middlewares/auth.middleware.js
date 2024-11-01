import ErrorResponse from '../utils/error.response.js';
import asyncHandler from './async.middleware.js';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = asyncHandler(async (req, res, next) => {
  const { sign, verify } = jwt;
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Not authorized to access this route', 401));
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
    next();
  } catch (error) {
    // Token is invalid, return an error
    let message = { success: 'Invalid Token' };
    return res.status(401).send({ success: false, message });
  }
});

export { protect };
