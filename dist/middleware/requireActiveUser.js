"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../errors/ApiError");
const User_1 = __importDefault(require("../models/User"));
const requireActiveUser = async (req, _res, next) => {
    const userId = req.user?.userId;
    if (!userId) {
        return next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Authentication required'));
    }
    const user = await User_1.default.findById(userId).select('status');
    if (!user) {
        return next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User not found'));
    }
    if (user.status !== 'active') {
        return next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, 'User account is inactive'));
    }
    return next();
};
exports.default = requireActiveUser;
