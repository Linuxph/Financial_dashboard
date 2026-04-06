"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listFinancialRecords = exports.deleteFinancialRecord = exports.updateFinancialRecord = exports.createFinancialRecord = void 0;
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utils/response");
const recordService_1 = require("../services/recordService");
const createFinancialRecord = async (req, res, next) => {
    try {
        const record = await (0, recordService_1.createRecord)({
            ...req.body,
            createdBy: req.user.userId
        });
        res.status(http_status_codes_1.StatusCodes.CREATED).json((0, response_1.buildResponse)(true, 'Record created successfully', record));
    }
    catch (error) {
        next(error);
    }
};
exports.createFinancialRecord = createFinancialRecord;
const updateFinancialRecord = async (req, res, next) => {
    try {
        const record = await (0, recordService_1.updateRecord)(req.params.recordId, req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.buildResponse)(true, 'Record updated successfully', record));
    }
    catch (error) {
        next(error);
    }
};
exports.updateFinancialRecord = updateFinancialRecord;
const deleteFinancialRecord = async (req, res, next) => {
    try {
        const record = await (0, recordService_1.deleteRecord)(req.params.recordId);
        res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.buildResponse)(true, 'Record deleted successfully', record));
    }
    catch (error) {
        next(error);
    }
};
exports.deleteFinancialRecord = deleteFinancialRecord;
const listFinancialRecords = async (req, res, next) => {
    try {
        const result = await (0, recordService_1.getRecords)(req.query);
        res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.buildResponse)(true, 'Records fetched successfully', result));
    }
    catch (error) {
        next(error);
    }
};
exports.listFinancialRecords = listFinancialRecords;
