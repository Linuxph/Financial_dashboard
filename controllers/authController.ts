import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { registerUser as registerUserService, loginUser as loginUserService } from '../services/authService';
import { buildResponse } from '../utils/response';

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await registerUserService(req.body);
    res.status(StatusCodes.CREATED).json(buildResponse(true, 'User registered successfully', user));
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService(email, password);
    res.status(StatusCodes.OK).json(buildResponse(true, 'Login successful', result));
  } catch (error) {
    next(error);
  }
};
