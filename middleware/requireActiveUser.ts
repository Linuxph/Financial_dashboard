import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../errors/ApiError';
import User from '../models/User';

const requireActiveUser = async (req: Request, _res: Response, next: NextFunction) => {
  const userId = req.user?.userId;
  if (!userId) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication required'));
  }

  const user = await User.findById(userId).select('status');
  if (!user) {
    return next(new ApiError(StatusCodes.UNAUTHORIZED, 'User not found'));
  }

  if (user.status !== 'active') {
    return next(new ApiError(StatusCodes.FORBIDDEN, 'User account is inactive'));
  }

  return next();
};

export default requireActiveUser;
