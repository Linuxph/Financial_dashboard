"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateUser = exports.getUsers = void 0;
const http_status_codes_1 = require("http-status-codes");
const userService_1 = require("../services/userService");
const response_1 = require("../utils/response");
const getUsers = async (_req, res, next) => {
    try {
        const users = await (0, userService_1.getUsers)();
        res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.buildResponse)(true, 'Users fetched successfully', users));
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const deactivateUser = async (req, res, next) => {
    try {
        const user = await (0, userService_1.deactivateUser)(req.params.userId);
        res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.buildResponse)(true, 'User deactivated successfully', user));
    }
    catch (error) {
        next(error);
    }
};
exports.deactivateUser = deactivateUser;
