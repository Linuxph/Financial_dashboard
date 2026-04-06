import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import User, { UserRole } from '../models/User';
import { ApiError } from '../errors/ApiError';
import { signToken } from '../utils/token';

const SALT_ROUNDS = 10;

export const registerUser = async (payload: {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}) => {
  const existingUser = await User.findOne({ email: payload.email.toLowerCase() });
  if (existingUser) {
    throw new ApiError(StatusCodes.CONFLICT, 'Email already in use');
  }

  const hashedPassword = await bcrypt.hash(payload.password, SALT_ROUNDS);
  const user = await User.create({
    name: payload.name,
    email: payload.email.toLowerCase(),
    password: hashedPassword,
    role: payload.role || 'viewer'
  });

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  if (user.status !== 'active') {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'User account is inactive');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid credentials');
  }

  const token = signToken({ userId: user._id.toString(), role: user.role });

  return {
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    }
  };
};
