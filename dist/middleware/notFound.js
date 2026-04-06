"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utils/response");
const notFoundMiddleware = (_req, res) => {
    res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json((0, response_1.buildResponse)(false, '404 page not found'));
};
exports.default = notFoundMiddleware;
