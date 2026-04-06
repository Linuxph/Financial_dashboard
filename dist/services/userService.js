"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateUser = exports.getUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = require("../errors/ApiError");
const getUsers = async () => {
    return User_1.default.find().select('-password').sort({ createdAt: -1 });
};
exports.getUsers = getUsers;
const deactivateUser = async (userId) => {
    const user = await User_1.default.findById(userId);
    if (!user) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.NOT_FOUND, 'User not found');
    }
    user.status = 'inactive';
    await user.save();
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    };
};
exports.deactivateUser = deactivateUser;
