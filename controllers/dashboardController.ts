import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { getDashboardSummary } from '../services/dashboardService';
import { buildResponse } from '../utils/response';

export const fetchDashboardSummary = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await getDashboardSummary();
    res.status(StatusCodes.OK).json(buildResponse(true, 'Dashboard summary fetched', summary));
  } catch (error) {
    next(error);
  }
};
