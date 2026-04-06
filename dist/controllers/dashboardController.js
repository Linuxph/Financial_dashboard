"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchDashboardSummary = void 0;
const http_status_codes_1 = require("http-status-codes");
const dashboardService_1 = require("../services/dashboardService");
const response_1 = require("../utils/response");
const fetchDashboardSummary = async (_req, res, next) => {
    try {
        const summary = await (0, dashboardService_1.getDashboardSummary)();
        res.status(http_status_codes_1.StatusCodes.OK).json((0, response_1.buildResponse)(true, 'Dashboard summary fetched', summary));
    }
    catch (error) {
        next(error);
    }
};
exports.fetchDashboardSummary = fetchDashboardSummary;
