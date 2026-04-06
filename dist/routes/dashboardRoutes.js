"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = require("../controllers/dashboardController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const roleMiddleware_1 = __importDefault(require("../middleware/roleMiddleware"));
const requireActiveUser_1 = __importDefault(require("../middleware/requireActiveUser"));
const router = (0, express_1.Router)();
/**
 * @openapi
 * /api/dashboard:
 *   get:
 *     summary: Fetch dashboard summary (analyst or admin)
 *     tags: [Dashboard]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard summary fetched
 */
router.get('/', authMiddleware_1.default, requireActiveUser_1.default, (0, roleMiddleware_1.default)(['analyst', 'admin']), dashboardController_1.fetchDashboardSummary);
exports.default = router;
