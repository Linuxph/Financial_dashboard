"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utils/response");
const errorHandlerMiddleware = (err, _req, res, _next) => {
    const statusCode = err.statusCode || http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Something went wrong';
    res.status(statusCode).json((0, response_1.buildResponse)(false, message));
};
exports.default = errorHandlerMiddleware;
