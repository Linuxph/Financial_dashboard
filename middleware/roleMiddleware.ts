import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../errors/ApiError';
import { UserRole } from '../models/User';

const roleMiddleware = (allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return next(new ApiError(StatusCodes.FORBIDDEN, 'You do not have access to this resource'));
    }
    return next();
  };
};

export default roleMiddleware;
