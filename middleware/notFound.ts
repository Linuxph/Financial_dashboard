import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { buildResponse } from '../utils/response';

const notFoundMiddleware = (_req: Request, res: Response) => {
  res.status(StatusCodes.NOT_FOUND).json(buildResponse(false, '404 page not found'));
};

export default notFoundMiddleware;
