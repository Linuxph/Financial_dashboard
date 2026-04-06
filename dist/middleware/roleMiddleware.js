"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const ApiError_1 = require("../errors/ApiError");
const roleMiddleware = (allowedRoles) => {
    return (req, _res, next) => {
        const role = req.user?.role;
        if (!role || !allowedRoles.includes(role)) {
            return next(new ApiError_1.ApiError(http_status_codes_1.StatusCodes.FORBIDDEN, 'You do not have access to this resource'));
        }
        return next();
    };
};
exports.default = roleMiddleware;
