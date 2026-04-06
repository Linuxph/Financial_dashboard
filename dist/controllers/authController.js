"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const http_status_codes_1 = require("http-status-codes");
const authService_1 = require("../services/authService");
const response_1 = require("../utils/response");
const registerUser = async (req, res, next) => {
    try {
        const user = await (0, authService_1.registerUser)(req.body);
        res.status(http_status_codes_1.StatusCodes.CREATED).json((0, response_1.buildResponse)(true, 'User registered successfully', user));
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const result = await (0, authService_1.loginUser)(email, password);
        res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.buildResponse)(true, 'Login successful', result));
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
