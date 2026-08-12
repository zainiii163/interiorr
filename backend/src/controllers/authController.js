import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

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

const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

function setRefreshCookie(res, token) {
  res.cookie('refreshToken', token, refreshCookieOptions);
}

async function registerFailedLogin(user) {
  if (!user) return;
  user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
  if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    user.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
  }
  await user.save({ validateBeforeSave: false });
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const user = await User.findOne({ email: email.toLowerCase() }).select(
    '+password +refreshToken'
  );

  if (user?.lockUntil && user.lockUntil > new Date()) {
    const mins = Math.ceil((user.lockUntil - Date.now()) / 60000);
    throw new ApiError(423, `Account locked due to failed logins. Try again in ${mins} minute(s).`);
  }

  if (!user || !(await user.comparePassword(password))) {
    if (user) await registerFailedLogin(user);
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!user.isActive) throw new ApiError(403, 'Account is inactive');

  user.failedLoginAttempts = 0;
  user.lockUntil = null;

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
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
  });
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
