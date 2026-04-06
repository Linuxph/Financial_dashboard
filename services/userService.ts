import { StatusCodes } from 'http-status-codes';
import User from '../models/User';
import { ApiError } from '../errors/ApiError';

export const getUsers = async () => {
  return User.find().select('-password').sort({ createdAt: -1 });
};

export const deactivateUser = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  }

  user.status = 'inactive';
  await user.save();

  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status
  };
};
