import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getUsers as getUsersService, deactivateUser as deactivateUserService } from '../services/userService';
import { buildResponse } from '../utils/response';

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await getUsersService();
    res.status(StatusCodes.OK).json(buildResponse(true, 'Users fetched successfully', users));
  } catch (error) {
    next(error);
  }
};

export const deactivateUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await deactivateUserService(req.params.userId);
    res.status(StatusCodes.OK).json(buildResponse(true, 'User deactivated successfully', user));
  } catch (error) {
    next(error);
  }
};
