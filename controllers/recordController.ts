import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { buildResponse } from '../utils/response';
import { createRecord, deleteRecord, getRecords, updateRecord } from '../services/recordService';

export const createFinancialRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await createRecord({
      ...req.body,
      createdBy: req.user!.userId
    });
    res.status(StatusCodes.CREATED).json(buildResponse(true, 'Record created successfully', record));
  } catch (error) {
    next(error);
  }
};

export const updateFinancialRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await updateRecord(req.params.recordId, req.body);
    res.status(StatusCodes.OK).json(buildResponse(true, 'Record updated successfully', record));
  } catch (error) {
    next(error);
  }
};

export const deleteFinancialRecord = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const record = await deleteRecord(req.params.recordId);
    res.status(StatusCodes.OK).json(buildResponse(true, 'Record deleted successfully', record));
  } catch (error) {
    next(error);
  }
};

export const listFinancialRecords = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await getRecords(req.query as Record<string, string>);
    res.status(StatusCodes.OK).json(buildResponse(true, 'Records fetched successfully', result));
  } catch (error) {
    next(error);
  }
};
