"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_status_codes_1 = require("http-status-codes");
const User_1 = __importDefault(require("../models/User"));
const ApiError_1 = require("../errors/ApiError");
const token_1 = require("../utils/token");
const SALT_ROUNDS = 10;
const registerUser = async (payload) => {
    const existingUser = await User_1.default.findOne({ email: payload.email.toLowerCase() });
    if (existingUser) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.CONFLICT, 'Email already in use');
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.password, SALT_ROUNDS);
    const user = await User_1.default.create({
        name: payload.name,
        email: payload.email.toLowerCase(),
        password: hashedPassword,
        role: payload.role || 'viewer'
    });
    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
    };
};
exports.registerUser = registerUser;
const loginUser = async (email, password) => {
    const user = await User_1.default.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }
    if (user.status !== 'active') {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'User account is inactive');
    }
    const isMatch = await bcrypt_1.default.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError_1.ApiError(http_status_codes_1.StatusCodes.UNAUTHORIZED, 'Invalid credentials');
    }
    const token = (0, token_1.signToken)({ userId: user._id.toString(), role: user.role });
    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            status: user.status
        }
    };
};
exports.loginUser = loginUser;
