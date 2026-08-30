import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';
import { Customer } from '../models/Customer.js';
import { Quote } from '../models/Quote.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { validatePasswordStrength } from '../middleware/validate.js';

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

function signAccessToken(customer) {
  return jwt.sign({ id: customer._id, role: 'customer' }, env.jwtAccessSecret, {
    expiresIn: env.jwtAccessExpires,
  });
}

function signRefreshToken(customer) {
  return jwt.sign({ id: customer._id, jti: crypto.randomUUID() }, env.jwtRefreshSecret, {
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
  res.cookie('customerRefreshToken', token, refreshCookieOptions);
}

function clearRefreshCookie(res) {
  res.clearCookie('customerRefreshToken', {
    httpOnly: true,
    secure: env.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

async function registerFailedLogin(customer) {
  if (!customer) return;
  customer.failedLoginAttempts = (customer.failedLoginAttempts || 0) + 1;
  if (customer.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
    customer.lockUntil = new Date(Date.now() + LOCK_MINUTES * 60 * 1000);
    console.warn(`[SECURITY] Customer account locked: ${customer.email}`);
  }
  await customer.save({ validateBeforeSave: false });
}

function customerPublic(c) {
  return {
    id: c._id,
    name: c.name,
    email: c.email,
    phone: c.phone,
    verified: c.verified,
    membership: c.membership || { status: 'none' },
  };
}

export const signup = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;
  if (!name || !email || !password) throw new ApiError(400, 'Name, email and password are required');

  const passwordErrors = validatePasswordStrength(password);
  if (passwordErrors.length) throw new ApiError(400, `Password: ${passwordErrors.join('; ')}`);

  const normalizedEmail = String(email).toLowerCase().trim();
  const existing = await Customer.findOne({ email: normalizedEmail });
  if (existing) throw new ApiError(409, 'An account with this email already exists');

  const verifyToken = crypto.randomBytes(24).toString('hex');
  const verifyTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const customer = await Customer.create({
    name: name.trim(),
    email: normalizedEmail,
    phone: phone || '',
    password,
    verified: false,
    verifyToken,
    verifyTokenExpires,
  });

  // Backfill: link any quotes created for this email to the new account.
  const backfilled = await Quote.updateMany(
    { leadEmail: normalizedEmail, customer: { $exists: false } },
    { $set: { customer: customer._id } }
  );

  // Send verification email (no-op if SMTP not configured).
  let verificationSent = false;
  try {
    const origin = req.body?.frontendOrigin || req.headers.origin || env.frontendUrl;
    const verifyUrl = `${origin}/verify-email?token=${verifyToken}`;
    const { sendCustomerVerification } = await import('../services/emailService.js');
    verificationSent = await sendCustomerVerification({
      to: customer.email,
      name: customer.name,
      verifyUrl,
    });
  } catch (err) {
    console.warn('[AUTH] Verification email failed:', err.message);
  }

  const accessToken = signAccessToken(customer);
  const refreshToken = signRefreshToken(customer);
  customer.refreshToken = refreshToken;
  customer.verifyToken = undefined;
  customer.verifyTokenExpires = undefined;
  await customer.save({ validateBeforeSave: false });
  setRefreshCookie(res, refreshToken);

  console.log(`[AUTH] Customer signup: ${customer.email} (linked quotes: ${backfilled.modifiedCount})`);
  res.status(201).json(
    new ApiResponse(
      201,
      {
        accessToken,
        token: accessToken,
        user: customerPublic(customer),
        verificationSent,
        message: verificationSent
          ? 'Account created. Please verify your email to activate it.'
          : 'Account created. (Email verification skipped — contact us if you cannot log in.)',
      },
      'Account created'
    )
  );
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.body || {};
  if (!token) throw new ApiError(400, 'Verification token is required');

  const customer = await Customer.findOne({ verifyToken: token }).select('+verifyToken +verifyTokenExpires');
  if (!customer || !customer.verifyTokenExpires || customer.verifyTokenExpires < new Date()) {
    throw new ApiError(400, 'Invalid or expired verification link');
  }

  customer.verified = true;
  customer.verifyToken = undefined;
  customer.verifyTokenExpires = undefined;
  await customer.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, null, 'Email verified successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');

  const customer = await Customer.findOne({ email: String(email).toLowerCase().trim() }).select(
    '+password +refreshToken'
  );

  if (customer?.lockUntil && customer.lockUntil > new Date()) {
    const mins = Math.ceil((customer.lockUntil - Date.now()) / 60000);
    throw new ApiError(423, `Account locked due to failed logins. Try again in ${mins} minute(s).`);
  }

  if (!customer || !(await customer.comparePassword(password))) {
    if (customer) await registerFailedLogin(customer);
    throw new ApiError(401, 'Invalid email or password');
  }
  if (!customer.isActive) throw new ApiError(403, 'Account is inactive');
  if (!customer.verified) {
    throw new ApiError(403, 'Please verify your email address before logging in');
  }

  customer.failedLoginAttempts = 0;
  customer.lockUntil = null;

  const accessToken = signAccessToken(customer);
  const refreshToken = signRefreshToken(customer);
  customer.refreshToken = refreshToken;
  await customer.save({ validateBeforeSave: false });
  setRefreshCookie(res, refreshToken);

  console.log(`[AUTH] Customer login: ${customer.email}`);
  res.status(200).json(
    new ApiResponse(
      200,
      { accessToken, token: accessToken, user: customerPublic(customer) },
      'Login successful'
    )
  );
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.customerRefreshToken;
  if (!token) throw new ApiError(401, 'Refresh token missing');

  let decoded;
  try {
    decoded = jwt.verify(token, env.jwtRefreshSecret);
  } catch {
    throw new ApiError(401, 'Invalid refresh token');
  }

  const customer = await Customer.findById(decoded.id).select('+refreshToken');
  if (!customer || customer.refreshToken !== token) throw new ApiError(401, 'Invalid refresh token');
  if (!customer.isActive) throw new ApiError(403, 'Account is inactive');

  const accessToken = signAccessToken(customer);
  const refreshToken = signRefreshToken(customer);
  customer.refreshToken = refreshToken;
  await customer.save({ validateBeforeSave: false });
  setRefreshCookie(res, refreshToken);

  res.status(200).json(new ApiResponse(200, { accessToken, token: accessToken }, 'Token refreshed'));
});

export const logout = asyncHandler(async (req, res) => {
  if (req.customer) {
    await Customer.findByIdAndUpdate(req.customer._id, { refreshToken: null });
  }
  clearRefreshCookie(res);
  res.status(200).json(new ApiResponse(200, null, 'Logged out'));
});

export const me = asyncHandler(async (req, res) => {
  res.status(200).json(
    new ApiResponse(200, {
      id: req.customer._id,
      name: req.customer.name,
      email: req.customer.email,
      phone: req.customer.phone,
      verified: req.customer.verified,
      membership: req.customer.membership || { status: 'none' },
    })
  );
});

export const myQuotes = asyncHandler(async (req, res) => {
  const quotes = await Quote.find({
    customer: req.customer._id,
  })
    .populate('lead', 'fullName email phone')
    .sort({ createdAt: -1 });

  res.status(200).json(
    new ApiResponse(
      200,
      quotes.map((q) => ({
        id: q._id,
        quoteNumber: q.quoteNumber,
        status: q.status,
        paymentStatus: q.paymentStatus,
        grandTotal: q.grandTotal,
        currency: q.currency,
        validUntil: q.validUntil,
        accessCode: q.accessCode,
        createdAt: q.createdAt,
        leadName: q.lead?.fullName || q.leadName,
      })),
      'My quotes'
    )
  );
});
