import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function signAccessToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpires,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ id: user._id }, env.jwtRefreshSecret, {
    expiresIn: env.jwtRefreshExpires,
  });
}

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: env.nodeEnv === 'production' ? 'lax' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'Account is inactive');

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  setRefreshCookie(res, refreshToken);

  res.status(200).json(
    new ApiResponse(200, {
      accessToken,
      token: accessToken,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    }, 'Login successful')
  );
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refreshToken;
  if (!token) throw new ApiError(401, 'Refresh token missing');

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtRefreshSecret);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  setRefreshCookie(res, refreshToken);

  res.status(200).json(new ApiResponse(200, { accessToken, token: accessToken }, 'Token refreshed'));
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await User.findByIdAndUpdate(req.user._id, { refreshToken: null });
  }
  res.clearCookie('refreshToken');
  res.status(200).json(new ApiResponse(200, null, 'Logged out'));
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    })
  );
});