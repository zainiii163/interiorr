import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

function formatUser(user) {
  const obj = user.toObject ? user.toObject() : { ...user };
  delete obj.password;
  delete obj.refreshToken;
  return {
    ...obj,
    status: obj.isActive ? 'active' : 'inactive',
  };
}

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password -refreshToken').sort({ createdAt: -1 });
  res.status(200).json(new ApiResponse(200, users.map(formatUser)));
});

export const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, isActive, status } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, 'Name, email, and password are required');
  }
  if (password.length < 8) {
    throw new ApiError(400, 'Password must be at least 8 characters');
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) throw new ApiError(400, 'User with this email already exists');

  const active = status ? status === 'active' : isActive !== false;

  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
    role: role || 'editor',
    isActive: active,
  });

  res.status(201).json(new ApiResponse(201, formatUser(user), 'User created'));
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const { name, email, role, password, isActive, status } = req.body;

  if (name) user.name = name;
  if (email) user.email = email.toLowerCase();
  if (role) user.role = role;
  if (status !== undefined) user.isActive = status === 'active';
  else if (isActive !== undefined) user.isActive = isActive;
  if (password) {
    if (password.length < 8) throw new ApiError(400, 'Password must be at least 8 characters');
    user.password = password;
  }

  await user.save();
  res.status(200).json(new ApiResponse(200, formatUser(user), 'User updated'));
});

export const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user._id.toString()) {
    throw new ApiError(400, 'You cannot delete your own account');
  }

  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) throw new ApiError(404, 'User not found');
  res.status(200).json(new ApiResponse(200, null, 'User deleted'));
});
