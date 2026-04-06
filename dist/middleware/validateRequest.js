"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_validator_1 = require("express-validator");
const http_status_codes_1 = require("http-status-codes");
const response_1 = require("../utils/response");
const validateRequest = (req, res, next) => {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json((0, response_1.buildResponse)(false, 'Validation failed', errors.array()));
    }
    return next();
};
exports.default = validateRequest;
