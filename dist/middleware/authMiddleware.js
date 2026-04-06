"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../errors/ApiError");
const token_1 = require("../utils/token");
const authMiddleware = (req, _res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Authentication required'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, token_1.verifyToken)(token);
        req.user = payload;
        return next();
    }
    catch (error) {
        return next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid or expired token'));
    }
};
exports.default = authMiddleware;
